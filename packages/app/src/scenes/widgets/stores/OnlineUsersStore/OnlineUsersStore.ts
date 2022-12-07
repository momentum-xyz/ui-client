import {cast, flow, types} from 'mobx-state-tree';
import {Dialog, RequestModel, ResetModel} from '@momentum-xyz/core';

import {User} from 'core/models';
import {api, GetDocksCountResponse, OdysseyOnlineUsersResponse} from 'api';
import {NftItem, NftItemInterface} from 'stores/NftStore/models';

import {OdysseyItemInterface} from '../OdysseyStore';

const OnlineUsersStore = types
  .compose(
    ResetModel,
    types.model('OnlineUsersStore', {
      searchWidget: types.optional(Dialog, {}),
      odysseyUsers: types.optional(types.array(User), []),
      allUsers: types.optional(types.array(User), []),
      searchedUsers: types.optional(types.array(User), []),
      selectedUserId: types.maybe(types.string),
      request: types.optional(RequestModel, {}),
      dockRequest: types.optional(RequestModel, {}),
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
      }
      self.nftId = worldId;
    },
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
    },
    unselectUser() {
      self.selectedUserId = undefined;
    },
    searchUsers(query: string): void {
      if (query.length > 1) {
        self.searchedUsers = cast([...self.allUsers.filter((user) => user.name.includes(query))]);
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
    }
  }));

export {OnlineUsersStore};
