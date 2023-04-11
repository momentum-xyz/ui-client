import {cast, types} from 'mobx-state-tree';
import {ResetModel} from '@momentum-xyz/core';

import {SearchQuery, Stake} from 'core/models';

const StakingViewStore = types.compose(
  ResetModel,
  types
    .model('StakingViewStore', {
      stakeList: types.optional(types.array(Stake), []),
      searchQuery: types.optional(SearchQuery, {})
    })
    .actions((self) => ({
      init(): void {
        self.stakeList = cast(
          [1, 2, 3, 4, 5].map((index) => ({
            uuid: `${index}`,
            nftId: `985abaef-c99d-4741-9df3-f4bf53eb5ced`,
            nftName: `A NAME of ODYSSEY ${index}`,
            nftImage: '888e06ec565bbd7fb8562428ae081359',
            userId: '985abaef-c99d-4741-9df3-f4bf53eb5ced',
            userName: `kovi_ps ${index}`,
            stakedAmount: 10.12,
            rewardAmount: 0.87,
            tokenSymbol: 'MOM'
          }))
        );
      }
    }))
    .views(() => ({}))
);

export {StakingViewStore};
