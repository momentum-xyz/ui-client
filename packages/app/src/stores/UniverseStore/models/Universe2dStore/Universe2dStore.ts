import {types} from 'mobx-state-tree';
import {cloneDeep} from 'lodash-es';
import {ResetModel} from '@momentum-xyz/core';
import {SliderItemInterface} from '@momentum-xyz/ui-kit-storybook';

import {NftItem, NftItemModelInterface, SearchQuery} from 'core/models';
import {getImageAbsoluteUrl, getRootStore} from 'core/utils';

const Universe2dStore = types.compose(
  ResetModel,
  types
    .model('Universe2dStore', {
      allUsers: types.optional(types.array(NftItem), []),
      allWorlds: types.optional(types.array(NftItem), []),
      searchQuery: types.optional(SearchQuery, {}),
      selectedWorld: types.maybeNull(types.string),
      selectedUser: types.maybeNull(types.string)
    })
    .actions((self) => ({
      init(): void {
        // TODO: implementation
        const {nftItems} = getRootStore(self).nftStore;
        self.allUsers = cloneDeep(nftItems);
        self.allWorlds = cloneDeep(nftItems);
      },
      selectWorld(world: string): void {
        self.selectedWorld = world;
      },
      selectUser(userId: string): void {
        self.selectedUser = userId;
      },
      resetUnits(): void {
        self.selectedWorld = null;
        self.selectedUser = null;
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
      },
      get hasSelectedUnit(): boolean {
        return !!self.selectedUser || !!self.selectedWorld;
      }
    }))
);

export {Universe2dStore};
