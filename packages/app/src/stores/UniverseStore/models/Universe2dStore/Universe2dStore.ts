import {cast, flow, types} from 'mobx-state-tree';
import BN from 'bn.js';
import {RequestModel, ResetModel} from '@momentum-xyz/core';
import {ImageSizeEnum, SliderItemInterface} from '@momentum-xyz/ui-kit-storybook';

import {api, UserInfoInterface, WorldInfoInterface} from 'api';
import {getImageAbsoluteUrl} from 'core/utils';
import {
  UserInfo,
  UserDetails,
  WorldInfo,
  WorldDetails,
  SearchQuery,
  UserInfoModelInterface,
  WorldInfoModelInterface
} from 'core/models';

const Universe2dStore = types.compose(
  ResetModel,
  types
    .model('Universe2dStore', {
      allUsers: types.optional(types.array(UserInfo), []),
      allWorlds: types.optional(types.array(WorldInfo), []),
      searchQuery: types.optional(SearchQuery, {}),

      selectedWorld: types.maybeNull(WorldDetails),
      selectedUser: types.maybeNull(UserDetails),

      worldsRequest: types.optional(RequestModel, {}),
      usersRequest: types.optional(RequestModel, {})
    })
    .actions((self) => ({
      init(): void {
        this.loadWorlds();
        this.loadUsers();
      },
      loadWorlds: flow(function* () {
        const worldsResponse: WorldInfoInterface[] = yield self.worldsRequest.send(
          api.worldRepository.fetchWorldList,
          {sortDirection: 'DESC', limit: 1000}
        );

        if (worldsResponse) {
          console.log('WORLDS', worldsResponse);
          self.allWorlds = cast(worldsResponse);
        }
      }),
      loadUsers: flow(function* () {
        const usersResponse: UserInfoInterface[] = yield self.usersRequest.send(
          api.userRepository.fetchUserList,
          {sortDirection: 'DESC', limit: 1000}
        );

        if (usersResponse) {
          console.log('USERS', usersResponse);
          self.allUsers = cast(usersResponse.filter((u) => !!u.name));
        }
      }),
      selectWorld(worldId: string): void {
        self.selectedWorld = WorldDetails.create({worldId});
        self.selectedUser = null;
      },
      selectUser(userId: string): void {
        self.selectedUser = UserDetails.create({userId});
        self.selectedWorld = null;
      },
      resetUnits(): void {
        self.selectedWorld = null;
        self.selectedUser = null;
      }
    }))
    .views((self) => ({
      get filteredWorlds(): WorldInfoModelInterface[] {
        return self.searchQuery.isQueryValid
          ? self.allWorlds.filter((world) => world.name.includes(self.searchQuery.queryLowerCased))
          : [];
      },
      get lastCreatedSliderWorlds(): SliderItemInterface<string>[] {
        return self.allWorlds.slice(0, 6).map((item) => ({
          id: item.id,
          name: item.name,
          image: getImageAbsoluteUrl(item.avatarHash, ImageSizeEnum.S5) || ''
        }));
      },
      get mostStakedWorlds(): WorldInfoModelInterface[] {
        return [...self.allWorlds]
          .sort((a, b) => {
            const aBN = new BN(a.stake_total || '0');
            const bBN = new BN(b.stake_total || '0');
            return bBN.sub(aBN).toNumber();
          })
          .slice(0, 6);
      },
      get mostStakedSliderWorlds(): SliderItemInterface<string>[] {
        return this.mostStakedWorlds.map((item) => ({
          id: item.id,
          name: item.name,
          image: getImageAbsoluteUrl(item.avatarHash, ImageSizeEnum.S5) || ''
        }));
      }
    }))
    .views((self) => ({
      get filteredUsers(): UserInfoModelInterface[] {
        return self.searchQuery.isQueryValid
          ? self.allUsers.filter((user) => user.name.includes(self.searchQuery.queryLowerCased))
          : [];
      },
      get lastCreatedSliderUsers(): SliderItemInterface<string>[] {
        return self.allUsers.slice(0, 6).map((item) => ({
          id: item.id,
          name: item.name,
          image: getImageAbsoluteUrl(item.profile.avatarHash, ImageSizeEnum.S5) || ''
        }));
      },
      get mostStakedUsers(): SliderItemInterface<string>[] {
        return self.allUsers.slice(0, 6).map((item) => ({
          id: item.id,
          name: item.name,
          image: getImageAbsoluteUrl(item.profile.avatarHash, ImageSizeEnum.S5) || ''
        }));
      }
    }))
    .views((self) => ({
      get hasSelectedUnit(): boolean {
        return !!self.selectedUser || !!self.selectedWorld;
      }
    }))
);

export {Universe2dStore};
