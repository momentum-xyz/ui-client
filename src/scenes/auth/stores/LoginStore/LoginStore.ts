import {flow, types} from 'mobx-state-tree';
import {UserManager} from 'oidc-client-ts';
import {t} from 'i18next';

import {storage} from 'core/services';
import {ResetModel} from 'core/models';
import {ROUTES} from 'core/constants';
import {Web3ConnectorInterface} from 'core/interfaces';
import {LoginTypeEnum, StorageKeyEnum, Web3ConnectorEnum, Web3ConnectorEnumList} from 'core/enums';
import SubstrateProvider from 'shared/services/web3/SubstrateProvider';
import {keycloakOidcConfig, web3OidcConfig, guestOidcConfig} from 'shared/auth';

const LoginStore = types.compose(
  ResetModel,
  types
    .model('LoginStore', {
      loginType: types.maybeNull(types.enumeration(Web3ConnectorEnumList)),
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
        storage.setString(StorageKeyEnum.Web3Connector, connector.name);
        self.loginType = connector.name;

        if (connector.name === Web3ConnectorEnum.Guest) {
          self.isGuestLoginStarted = true;
          return;
        }

        if (connector.name === Web3ConnectorEnum.Polkadot) {
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
      async keycloakSignIn(): Promise<void> {
        storage.setString(StorageKeyEnum.LoginType, LoginTypeEnum.Keycloak);
        const origin = window.history.state?.origin || ROUTES.base;
        const userManager = new UserManager(keycloakOidcConfig);
        await userManager.signinRedirect({state: {origin: origin}});
      },
      async web3SignIn(): Promise<void> {
        storage.setString(StorageKeyEnum.LoginType, LoginTypeEnum.Web3);
        const origin = window.history.state?.origin || ROUTES.base;
        const userManager = new UserManager(web3OidcConfig);
        // @ts-ignore: oidc bug
        await userManager.signinRedirect({state: {origin: origin}, login_hint: self.loginType});
      },
      async guestSignIn(): Promise<void> {
        storage.setString(StorageKeyEnum.LoginType, LoginTypeEnum.Guest);
        const origin = window.history.state?.origin || ROUTES.base;
        const userManager = new UserManager(guestOidcConfig);
        // @ts-ignore: oidc bug
        await userManager.signinRedirect({state: {origin: origin}, login_hint: self.loginType});
      }
    }))
);

export {LoginStore};
