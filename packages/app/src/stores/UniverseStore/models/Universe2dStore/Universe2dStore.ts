import {cast, flow, types} from 'mobx-state-tree';
import BN from 'bn.js';
import {RequestModel, ResetModel} from '@momentum-xyz/core';
import {ImageSizeEnum, SliderItemInterface} from '@momentum-xyz/ui-kit-storybook';

import {api, BigStakerInfoInterface, UserInfoInterface, WorldInfoInterface} from 'api';
import {getImageAbsoluteUrl} from 'core/utils';
import {
  UserInfo,
  UserDetails,
  WorldInfo,
  WorldDetails,
  SearchQuery,
  BigStakerInfo,
  UserInfoModelInterface,
  WorldInfoModelInterface
} from 'core/models';
import {BN_ONE} from 'core/constants';

const Universe2dStore = types.compose(
  ResetModel,
  types
    .model('Universe2dStore', {
      allUsers: types.optional(types.array(UserInfo), []),
      allWorlds: types.optional(types.array(WorldInfo), []),
      bigStakers: types.optional(types.array(BigStakerInfo), []),
      searchQuery: types.optional(SearchQuery, {}),

      selectedWorld: types.maybeNull(WorldDetails),
      selectedUser: types.maybeNull(UserDetails),

      worldsRequest: types.optional(RequestModel, {}),
      usersRequest: types.optional(RequestModel, {}),
      bigStakersRequest: types.optional(RequestModel, {})
    })
    .actions((self) => ({
      async init() {
        await this.loadUsers();
        await this.loadWorlds();
        await this.loadBigStakers();
      },
      loadWorlds: flow(function* () {
        const worldsResponse: WorldInfoInterface[] = yield self.worldsRequest.send(
          api.worldRepository.fetchWorldList,
          {sortDirection: 'DESC', limit: 1000}
        );

        if (worldsResponse) {
          console.log('[UNIVERSE] WORLDS', worldsResponse);
          self.allWorlds = cast(worldsResponse);
        }
      }),
      loadUsers: flow(function* () {
        const usersResponse: UserInfoInterface[] = yield self.usersRequest.send(
          api.userRepository.fetchUserList,
          {sortDirection: 'DESC', limit: 1000}
        );

        if (usersResponse) {
          console.log('[UNIVERSE] USERS', usersResponse);
          self.allUsers = cast(usersResponse.filter((u) => !!u.name));
        }
      }),
      loadBigStakers: flow(function* () {
        const usersResponse: BigStakerInfoInterface[] = yield self.bigStakersRequest.send(
          api.userRepository.fetchBigStakersList,
          {}
        );

        if (usersResponse) {
          console.log('[UNIVERSE] BIG STAKERS', usersResponse);
          self.bigStakers = cast(usersResponse);
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
          .filter((item) => item.stake_total !== '0')
          .sort((a, b) => {
            const aBN = new BN(a.stake_total || '0');
            const bBN = new BN(b.stake_total || '0');
            return bBN.sub(aBN).mod(BN_ONE).toNumber();
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
        return self.bigStakers.map((item) => ({
          id: item.user_id,
          name: item.name,
          image: getImageAbsoluteUrl(item.avatarHash, ImageSizeEnum.S5) || ''
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
