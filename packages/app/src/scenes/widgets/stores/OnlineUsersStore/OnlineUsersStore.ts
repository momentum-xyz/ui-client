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
  SpaceAttributeItemResponse,
  UserInterface
} from 'api';
import {NftItem, NftItemInterface} from 'stores/NftStore/models';
import {appVariables} from 'api/constants';

import {OdysseyItemInterface} from '../OdysseyBioStore';

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
      worldId: types.maybe(types.string),
      dockRequest: types.optional(RequestModel, {}),
      fetchUserRequest: types.optional(RequestModel, {}),
      nftItem: types.maybe(NftItem),
      nftId: types.maybe(types.string),
      docks: 0,
      events: 0
    })
  )
  .actions((self) => ({
    init(worldId: string, userId: string): void {
      self.worldId = worldId;
      this.fetchOdysseyUsers(worldId, userId);
    },
    findOdyssey(items: Array<NftItemInterface>, worldId: string): void {
      const nft: NftItemInterface | undefined = items.find((nft) => nft.uuid === worldId);
      if (nft) {
        self.nftItem = {...nft};
        self.nftId = worldId;
        this.fetchUser(worldId);
      } else {
        self.nftItem = undefined;
        self.nftId = undefined;
        this.fetchUser(worldId);
      }
    },
    fetchUser: flow(function* (userId: string) {
      const user: FetchUserResponse = yield self.fetchUserRequest.send(
        api.userRepository.fetchUser,
        {userId}
      );
      if (user) {
        self.user = {...user};
      }
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
      this.findOdyssey(items, userId);
      this.fetchDocksCount(userId);
      this.fetchEventsCount(userId);
    },
    unselectUser() {
      self.selectedUserId = undefined;
      self.user = undefined;
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
    }),
    fetchEventsCount: flow(function* (spaceId: string) {
      const response: SpaceAttributeItemResponse = yield self.request.send(
        api.eventsRepository.getEventAttributes,
        {
          spaceId
        }
      );

      if (response && Object.keys(response).length) {
        self.events = Object.keys(response).length;
      } else {
        self.events = 0;
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
        docking: self.docks,
        events: self.events
      };
    },
    get avatarSrc(): string | undefined {
      if (!self.user) {
        return '';
      }
      return (
        self.user?.profile.avatarHash &&
        `${appVariables.RENDER_SERVICE_URL}/texture/${ImageSizeEnum.S3}/${self.user.profile.avatarHash}`
      );
    }
  }));

export {OnlineUsersStore};
