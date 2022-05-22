import {cast, flow, types} from 'mobx-state-tree';
import {InjectedAccountWithMeta} from '@polkadot/extension-inject/types';

import {DELAY_DEFAULT, wait} from 'core/utils';
import {RequestModel, ResetModel} from 'core/models';
import {LoginTypeEnum, LoginTypeEnumList} from 'core/enums';
import SubstrateProvider from 'shared/services/web3/SubstrateProvider';
import {
  api,
  GuestLoginRequest,
  GuestLoginResponse,
  Web3LoginHintRequest,
  Web3LoginHintResponse
} from 'api';

const Web3ChoiceStore = types.compose(
  ResetModel,
  types
    .model('Web3ChoiceStore', {
      request: types.optional(RequestModel, {}),
      loginType: types.maybeNull(types.enumeration(LoginTypeEnumList)),
      accounts: types.optional(types.array(types.frozen<InjectedAccountWithMeta>()), []),
      selectedAccount: types.maybeNull(types.string),
      guestRedirect: types.maybeNull(types.string)
    })
    .actions((self) => ({
      fetchLoginType: flow(function* (login_challenge: string) {
        const data: Web3LoginHintRequest = {login_challenge};
        const response: Web3LoginHintResponse = yield self.request.send(
          api.webRepository.getLoginHintByLogin,
          data
        );

        if (response) {
          self.loginType = response.loginHint as LoginTypeEnum;
        }
      }),
      fetchAccountList: flow(function* () {
        // Waiting for polkadot.js extension
        yield wait(DELAY_DEFAULT);

        if (yield SubstrateProvider.isExtensionEnabled()) {
          const addressesList = yield SubstrateProvider.getAllAddresses();
          self.accounts = cast(addressesList);
        }
      }),
      guestLogin: flow(function* (challenge: string) {
        const data: GuestLoginRequest = {challenge};
        const response: GuestLoginResponse = yield self.request.send(
          api.guestRepository.loginGuest,
          data
        );

        if (response) {
          self.guestRedirect = response.redirect;
        }
      }),
      selectAccount(address: string): void {
        self.selectedAccount = address;
      }
    }))
    .views((self) => ({
      get accountList(): InjectedAccountWithMeta[] {
        return [...self.accounts];
      }
    }))
);

export {Web3ChoiceStore};
