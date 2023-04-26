import {cast, flow, types} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum-xyz/core';

import {api, StakeInfoInterface} from 'api';
import {SearchQuery, Stake, Wallet, StakeModelInterface, SortField, FilterField} from 'core/models';

const StakingViewStore = types.compose(
  ResetModel,
  types
    .model('StakingViewStore', {
      wallets: types.optional(types.array(Wallet), []),
      stakeList: types.optional(types.array(Stake), []),
      searchQuery: types.optional(SearchQuery, {}),
      filterField: types.optional(FilterField, {}),
      sortField: types.optional(SortField, {}),
      walletsRequest: types.optional(RequestModel, {}),
      stakesRequest: types.optional(RequestModel, {})
    })
    .actions((self) => ({
      init(): void {
        this.loadWallets();
        this.loadStakes();
      },
      loadWallets: flow(function* () {
        const response = yield self.walletsRequest.send(api.userRepository.fetchMyWallets, {});
        console.log(response);
      }),
      loadStakes: flow(function* () {
        const response: Array<StakeInfoInterface> = yield self.walletsRequest.send(
          api.userRepository.fetchMyStakes,
          {}
        );
        if (response) {
          self.stakeList = cast(response);
        }
      })
    }))
    .views((self) => ({
      get filteredStakeList(): StakeModelInterface[] {
        const result = self.filterField.fieldName
          ? self.stakeList.filter((stake) => stake.wallet_id === self.filterField.fieldName)
          : self.stakeList;

        const {queryLowerCased} = self.searchQuery;
        return self.searchQuery.isQueryValid
          ? result.filter((stake) => stake.name.toLowerCase().includes(queryLowerCased))
          : result;
      },
      get filteredAndSortedStakeList(): StakeModelInterface[] {
        switch (self.sortField.fieldName) {
          case 'mostStaked':
            return this.filteredStakeList.slice().sort((a, b) => {
              return Number(Number(b.amount) - Number(a.amount));
            });
        }
        return this.filteredStakeList;
      }
    }))
);

export {StakingViewStore};
