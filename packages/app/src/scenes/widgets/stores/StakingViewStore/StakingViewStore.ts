import {cast, types} from 'mobx-state-tree';
import {ResetModel} from '@momentum-xyz/core';

import {SearchQuery, Stake, Wallet, StakeModelInterface, SortField, FilterField} from 'core/models';

const StakingViewStore = types.compose(
  ResetModel,
  types
    .model('StakingViewStore', {
      // FIXME: Some common store
      wallets: types.optional(types.array(Wallet), []),
      stakeList: types.optional(types.array(Stake), []),

      searchQuery: types.optional(SearchQuery, {}),
      filterField: types.optional(FilterField, {}),
      sortField: types.optional(SortField, {})
    })
    .actions((self) => ({
      init(): void {
        // FIXME: REAL DATA
        self.wallets = cast(
          [0, 1, 2, 3, 4, 5].map((index) => ({
            hash: `0x${index}21876114ac93f3691a432347a5bf1badc8f8236f`,
            rewardsAmount: index + 0.21,
            balanceAmount: index + 0.13101,
            transferableAmount: index + 0.4101,
            unbondingAmount: index + 0.5101,
            stakedAmount: index + 0.8901,
            symbol: 'MOM'
          }))
        );

        self.stakeList = cast(
          self.wallets.map((wallet, index) => ({
            uuid: `${index}`,
            wallet: wallet.hash,
            nftId: `985abaef-c99d-4741-9df3-f4bf53eb5ced`,
            nftName: `A NAME of ODYSSEY ${index}`,
            nftImage: '888e06ec565bbd7fb8562428ae081359',
            userId: '985abaef-c99d-4741-9df3-f4bf53eb5ced',
            userName: `kovi_ps ${index}`,
            stakedAmount: 10.12 + index,
            rewardAmount: 0.87 + index,
            tokenSymbol: 'MOM'
          }))
        );
      }
    }))
    .views((self) => ({
      get filteredStakeList(): StakeModelInterface[] {
        const result = self.filterField.fieldName
          ? self.stakeList.filter((stake) => stake.wallet === self.filterField.fieldName)
          : self.stakeList;

        const {queryLowerCased} = self.searchQuery;
        return self.searchQuery.isQueryValid
          ? result.filter((stake) => stake.nftName.toLowerCase().includes(queryLowerCased))
          : result;
      },
      get filteredAndSortedStakeList(): StakeModelInterface[] {
        switch (self.sortField.fieldName) {
          case 'mostStaked':
            return this.filteredStakeList.slice().sort((a, b) => {
              return b.stakedAmount - a.stakedAmount;
            });
        }
        return this.filteredStakeList;
      }
    }))
);

export {StakingViewStore};
