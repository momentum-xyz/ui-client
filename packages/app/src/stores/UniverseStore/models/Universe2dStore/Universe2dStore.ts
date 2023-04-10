import {castToSnapshot, types} from 'mobx-state-tree';
import {ResetModel} from '@momentum-xyz/core';
import {ImageSizeEnum, SliderItemInterface} from '@momentum-xyz/ui-kit-storybook';

import {NftItem, NftItemModelInterface, SearchQuery} from 'core/models';
import {getImageAbsoluteUrl, getRootStore} from 'core/utils';

import {WorldDetails, UserDetails} from './models';

const Universe2dStore = types.compose(
  ResetModel,
  types
    .model('Universe2dStore', {
      allUsers: types.optional(types.array(types.reference(NftItem)), []),
      allWorlds: types.optional(types.array(types.reference(NftItem)), []),
      searchQuery: types.optional(SearchQuery, {}),
      selectedWorld: types.maybeNull(WorldDetails),
      selectedUser: types.maybeNull(UserDetails)
    })
    .actions((self) => ({
      init(): void {
        // TODO: implementation
        const {nftItems} = getRootStore(self).nftStore;

        self.allUsers = castToSnapshot(nftItems.filter((i) => !i.image?.includes('http')));
        self.allWorlds = castToSnapshot(nftItems.filter((i) => !i.image?.includes('http')));
      },
      selectWorld(worldId: string): void {
        const world = self.allWorlds.find((world) => world.uuid === worldId);
        self.selectedWorld = world ? WorldDetails.create({world: world.id}) : null;
        self.selectedUser = null;
        self.selectedWorld?.init();
      },
      selectUser(userId: string): void {
        const user = self.allUsers.find((user) => user.uuid === userId);
        self.selectedUser = user ? UserDetails.create({user: user.id}) : null;
        self.selectedWorld = null;
        self.selectedUser?.init();
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
        return self.allWorlds.slice(0, 6).map((item) => ({
          id: item.uuid,
          name: item.name,
          image: getImageAbsoluteUrl(item.image, ImageSizeEnum.S5) || ''
        }));
      },
      get mostStatedUsers(): SliderItemInterface<string>[] {
        return self.allWorlds.slice(6, 12).map((item) => ({
          id: item.uuid,
          name: item.name,
          image: getImageAbsoluteUrl(item.image, ImageSizeEnum.S5) || ''
        }));
      },
      get lastCreatedWorlds(): SliderItemInterface<string>[] {
        return self.allWorlds.slice(12, 18).map((item) => ({
          id: item.uuid,
          name: item.name,
          image: getImageAbsoluteUrl(item.image, ImageSizeEnum.S5) || ''
        }));
      },
      get mostStatedInWorlds(): SliderItemInterface<string>[] {
        return self.allWorlds.slice(18, 24).map((item) => ({
          id: item.uuid,
          name: item.name,
          image: getImageAbsoluteUrl(item.image, ImageSizeEnum.S5) || ''
        }));
      },
      get hasSelectedUnit(): boolean {
        return !!self.selectedUser || !!self.selectedWorld;
      }
    }))
);

export {Universe2dStore};
