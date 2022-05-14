import {flow, types} from 'mobx-state-tree';
import {InjectedAccountWithMeta} from '@polkadot/extension-inject/types';

import {storage} from 'core/services';
import {RequestModel, ResetModel} from 'core/models';
import {api, Web3LoginHintRequest, Web3LoginHintResponse} from 'api';
import {StorageKeyEnum, Web3ConnectorEnum, Web3ConnectorEnumList} from 'core/enums';
import SubstrateProvider from 'shared/services/web3/SubstrateProvider';

const Web3ChoiceStore = types.compose(
  ResetModel,
  types
    .model('Web3ChoiceStore', {
      request: types.optional(RequestModel, {}),
      loginType: types.maybeNull(types.enumeration(Web3ConnectorEnumList)),
      accounts: types.optional(types.array(types.frozen<InjectedAccountWithMeta>()), []),
      selectedAccount: types.maybeNull(types.string)
    })
    .actions((self) => ({
      fetchLoginType: flow(function* (login_challenge: string) {
        const data: Web3LoginHintRequest = {login_challenge};
        const response: Web3LoginHintResponse = yield self.request.send(
          api.webRepository.getLoginHint,
          data
        );

        if (response) {
          self.loginType = response.loginHint as Web3ConnectorEnum;
        }
      }),
      fetchAccountList: flow(function* () {
        if (yield SubstrateProvider.isExtensionEnabled()) {
          self.accounts = yield SubstrateProvider.getAddresses();
        }
      }),
      selectAccount(address: string): void {
        storage.setString(StorageKeyEnum.PolkadotAddress, address);
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
