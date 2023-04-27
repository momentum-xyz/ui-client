import {types} from 'mobx-state-tree';
import {ResetModel} from '@momentum-xyz/core';

import {getRootStore} from 'core/utils';
import {SearchQuery, StakeModelInterface, SortField, FilterField} from 'core/models';

const StakingViewStore = types.compose(
  ResetModel,
  types
    .model('StakingViewStore', {
      searchQuery: types.optional(SearchQuery, {}),
      filterField: types.optional(FilterField, {}),
      sortField: types.optional(SortField, {})
    })
    .views((self) => ({
      get filteredStakeList(): StakeModelInterface[] {
        const stakes = getRootStore(self).nftStore.stakes;
        const result = self.filterField.fieldName
          ? stakes.filter((stake) => stake.wallet_id === self.filterField.fieldName)
          : stakes;

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
