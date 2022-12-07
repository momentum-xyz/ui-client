import {cast, flow, types} from 'mobx-state-tree';
import {Dialog, RequestModel, ResetModel} from '@momentum-xyz/core';
import {cloneDeep} from 'lodash-es';
import {ImageSizeEnum} from '@momentum-xyz/ui-kit';

import {User} from 'core/models';
import {
  api,
  FetchUserResponse,
  GetDocksCountResponse,
  OdysseyOnlineUsersResponse,
  UserInterface
} from 'api';
import {NftItem, NftItemInterface} from 'stores/NftStore/models';
import {appVariables} from 'api/constants';

import {OdysseyItemInterface} from '../OdysseyStore';

const OnlineUsersStore = types
  .compose(
    ResetModel,
    types.model('OnlineUsersStore', {
      searchWidget: types.optional(Dialog, {}),
      odysseyUsers: types.optional(types.array(User), []),
      allUsers: types.array(User),
      user: types.maybe(types.frozen<UserInterface>()),
      searchedUsers: types.maybe(types.array(User)),
      query: types.maybe(types.string),
      selectedUserId: types.maybe(types.string),
      request: types.optional(RequestModel, {}),
      dockRequest: types.optional(RequestModel, {}),
      fetchUserRequest: types.optional(RequestModel, {}),
      nftItem: types.maybe(NftItem),
      nftId: types.maybe(types.string),
      docks: types.maybe(types.number)
    })
  )
  .actions((self) => ({
    init(worldId: string, userId: string): void {
      this.fetchOdysseyUsers(worldId, userId);
    },
    findOdyssey(items: Array<NftItemInterface>, worldId: string): void {
      const nft: NftItemInterface | undefined = items.find((nft) => nft.uuid === worldId);
      if (nft) {
        self.nftItem = {...nft};
        this.fetchUser(worldId);
      } else {
        self.nftItem = undefined;
        this.fetchUser(worldId);
      }
      console.info('nft', nft);
      self.nftId = worldId;
    },
    fetchUser: flow(function* (userId: string) {
      const user: FetchUserResponse = yield self.fetchUserRequest.send(
        api.userRepository.fetchUser,
        {userId}
      );
      self.user = {...user};
    }),
    fetchOdysseyUsers: flow(function* (worldId: string, currentUserId: string) {
      const response: OdysseyOnlineUsersResponse = yield self.request.send(
        api.worldRepository.fetchOnlineUsers,
        {worldId}
      );

      if (response) {
        self.allUsers = cast(response);
        self.odysseyUsers = cast([...response.filter((user) => user.id !== currentUserId)]);
      }
    }),
    selectUser(items: Array<NftItemInterface>, userId: string) {
      self.selectedUserId = userId;
      console.info(userId);
      this.findOdyssey(items, userId);
    },
    unselectUser() {
      self.selectedUserId = undefined;
    },
    searchUsers(query: string): void {
      if (query.length > 0) {
        self.query = query;
        const users = cloneDeep(
          self.allUsers.filter((user) => user.name.toLowerCase().includes(query))
        );
        self.searchedUsers = cast(users);
      } else {
        self.searchedUsers = undefined;
        self.query = undefined;
      }
    },
    fetchDocksCount: flow(function* (spaceId: string) {
      const response: GetDocksCountResponse | undefined = yield self.request.send(
        api.spaceRepository.fetchDocksCount,
        {spaceId}
      );

      if (response) {
        self.docks = response.count;
      }
    })
  }))
  .views((self) => ({
    get odyssey(): OdysseyItemInterface | null {
      if (!self.nftItem) {
        return null;
      }

      return {
        ...self.nftItem,
        connections: 0,
        docking: self.docks ?? 0,
        events: 0
      };
    },
    get avatarSrc(): string | undefined {
      return (
        self.user?.profile.avatarHash &&
        `${appVariables.RENDER_SERVICE_URL}/texture/${ImageSizeEnum.S3}/${self.user.profile.avatarHash}`
      );
    }
  }));

export {OnlineUsersStore};
