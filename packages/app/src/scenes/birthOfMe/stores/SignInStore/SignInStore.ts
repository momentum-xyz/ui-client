import {cast, flow, types} from 'mobx-state-tree';
import {ResetModel} from '@momentum-xyz/core';
import {OptionInterface} from '@momentum-xyz/ui-kit';
import {InjectedAccountWithMeta} from '@polkadot/extension-inject/types';

import {DELAY_DEFAULT, wait} from 'core/utils';
import SubstrateProvider from 'shared/services/web3/SubstrateProvider';

const SignInStore = types.compose(
  ResetModel,
  types
    .model('SignInStore', {
      accounts: types.optional(types.array(types.frozen<InjectedAccountWithMeta>()), []),
      selectedAddress: types.maybeNull(types.string)
    })
    .actions((self) => ({
      fetchAddresses: flow(function* () {
        if (!self.accounts.length) {
          yield wait(DELAY_DEFAULT);
          if (yield SubstrateProvider.isExtensionEnabled()) {
            const addressesList = yield SubstrateProvider.getAddresses();
            self.accounts = cast(addressesList);
          }
        }
      }),
      selectAddress(address: string): void {
        self.selectedAddress = address;
      }
    }))
    .views((self) => ({
      get accountOptions(): OptionInterface[] {
        return self.accounts.map((account) => ({
          label: account.meta.name || account.address,
          value: account.address,
          icon: 'polkadotprofile'
        }));
      }
    }))
);

export {SignInStore};
