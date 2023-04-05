import {types} from 'mobx-state-tree';
import {cloneDeep} from 'lodash-es';
import {ResetModel} from '@momentum-xyz/core';
import {SliderItemInterface} from '@momentum-xyz/ui-kit-storybook';

import {NftItemModelInterface, SearchQuery} from 'core/models';
import {getImageAbsoluteUrl, getRootStore} from 'core/utils';

const Universe2dStore = types.compose(
  ResetModel,
  types
    .model('Universe2dStore', {
      allUsers: types.optional(types.array(types.frozen<NftItemModelInterface>()), []),
      allWorlds: types.optional(types.array(types.frozen<NftItemModelInterface>()), []),
      searchQuery: types.optional(SearchQuery, {})
    })
    .actions((self) => ({
      init(): void {
        // TODO: implementation
        const {nftItems} = getRootStore(self).nftStore;
        self.allUsers = cloneDeep(nftItems);
        self.allWorlds = cloneDeep(nftItems);
      }
    }))
    .views((self) => ({
      get filteredUsers(): NftItemModelInterface[] {
        return self.searchQuery.isQueryValid
          ? self.allUsers.filter((user) => user.name.includes(self.searchQuery.queryLowerCased))
          : [];
      },
      get filteredWorlds(): NftItemModelInterface[] {
        return self.searchQuery.isQueryValid
          ? self.allWorlds.filter((world) => world.name.includes(self.searchQuery.queryLowerCased))
          : [];
      },
      get lastCreatedUsers(): SliderItemInterface<string>[] {
        return self.allWorlds.slice(0, 5).map((item) => ({
          id: item.uuid,
          name: item.name,
          image: getImageAbsoluteUrl(item.image) || ''
        }));
      },
      get mostStatedUsers(): SliderItemInterface<string>[] {
        return self.allWorlds.slice(5, 10).map((item) => ({
          id: item.uuid,
          name: item.name,
          image: getImageAbsoluteUrl(item.image) || ''
        }));
      },
      get lastCreatedWorlds(): SliderItemInterface<string>[] {
        return self.allWorlds.slice(20, 25).map((item) => ({
          id: item.uuid,
          name: item.name,
          image: getImageAbsoluteUrl(item.image) || ''
        }));
      },
      get mostStatedInWorlds(): SliderItemInterface<string>[] {
        return self.allWorlds.slice(25, 30).map((item) => ({
          id: item.uuid,
          name: item.name,
          image: getImageAbsoluteUrl(item.image) || ''
        }));
      }
    }))
);

export {Universe2dStore};
