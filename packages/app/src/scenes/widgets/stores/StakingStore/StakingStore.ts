import {types} from 'mobx-state-tree';
import {ResetModel} from '@momentum/core';

import {DialogModel} from 'core/models';

import {ValidatorsStore, PolkadotProviderStore} from './models';

const StakingStore = types.compose(
  ResetModel,
  types
    .model('StakingStore', {
      polkadotProviderStore: types.optional(PolkadotProviderStore, {}),
      validatorsStore: types.optional(ValidatorsStore, {}),
      stakingDialog: types.optional(DialogModel, {}),
      operatorSpaceId: types.optional(types.string, '')
    })
    .actions((self) => ({
      async fetchValidators(): Promise<void> {
        await self.validatorsStore.fetch(self.operatorSpaceId);
      },
      setOperatorSpaceId(operatorSpaceId: string): void {
        self.operatorSpaceId = operatorSpaceId;
      },
      clearStore() {
        self.operatorSpaceId = '';
        self.validatorsStore.resetModel();
      }
    }))
);

export default StakingStore;
