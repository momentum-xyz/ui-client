import {flow, types} from 'mobx-state-tree';
import {UserManager} from 'oidc-client-ts';
import {t} from 'i18next';
import {ResetModel} from '@momentum-xyz/core';

import {storage} from 'shared/services';
import {ROUTES} from 'core/constants';
import {Web3ConnectorInterface} from 'core/interfaces';
import {LoginTypeEnum, StorageKeyEnum, LoginTypeEnumList} from 'core/enums';
import SubstrateProvider from 'shared/services/web3/SubstrateProvider';
import {keycloakOidcConfig, web3OidcConfig, guestOidcConfig} from 'shared/auth';

const LoginStore = types.compose(
  ResetModel,
  types
    .model('LoginStore', {
      loginType: types.maybeNull(types.enumeration(LoginTypeEnumList)),
      errorMessage: types.maybeNull(types.string),
      isSessionExpired: false,
      isWeb3LoginStarted: false,
      isGuestLoginStarted: false,
      isRefreshButtonShown: false
    })
    .actions((self) => ({
      setIsSessionExpired(isSessionExpired: boolean): void {
        self.isSessionExpired = isSessionExpired;
      },
      chooseNetwork: flow(function* (connector: Web3ConnectorInterface) {
        self.loginType = connector.name;

        if (connector.name === LoginTypeEnum.Guest) {
          self.isGuestLoginStarted = true;
          return;
        }

        if (connector.name === LoginTypeEnum.Polkadot) {
          if (!(yield SubstrateProvider.isExtensionEnabled())) {
            const name = t(`networks.${connector.name}`);
            self.errorMessage = t('errors.ethereumExtension', {name});
            self.isRefreshButtonShown = true;
            return;
          }

          /* User doesn't have any accounts */
          const accountList = yield SubstrateProvider.getAddresses();
          if (accountList.length === 0) {
            self.errorMessage = t('errors.noAccounts');
            self.isRefreshButtonShown = true;
            return;
          }

          self.isWeb3LoginStarted = true;
        }
      }),
      keycloakSignIn: flow(function* () {
        storage.setString(StorageKeyEnum.LoginType, LoginTypeEnum.Keycloak);
        const from = window.history.state?.state?.from || ROUTES.base;
        const userManager = new UserManager(keycloakOidcConfig());
        yield userManager.signinRedirect({state: {from}});
      }),
      web3SignIn: flow(function* () {
        if (!self.loginType) {
          return;
        }
        storage.setString(StorageKeyEnum.LoginType, self.loginType);
        const from = window.history.state?.state?.from || ROUTES.base;
        const args = {state: {from}, login_hint: self.loginType};
        const userManager = new UserManager(web3OidcConfig());
        yield userManager.signinRedirect(args);
      }),
      guestSignIn: flow(function* () {
        if (!self.loginType) {
          return;
        }
        storage.setString(StorageKeyEnum.LoginType, self.loginType);
        const from = window.history.state?.state?.from || ROUTES.base;
        const args = {state: {from}, login_hint: self.loginType};
        const userManager = new UserManager(guestOidcConfig());
        yield userManager.signinRedirect(args);
      })
    }))
);

export {LoginStore};
