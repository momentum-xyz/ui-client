import {cast, flow, types} from 'mobx-state-tree';
import {Dialog, RequestModel, ResetModel} from '@momentum-xyz/core';
import {cloneDeep} from 'lodash-es';

import {api, OdysseyOnlineUsersResponse, SpaceAttributeItemResponse, UserInterface} from 'api';
import {getRootStore} from 'core/utils';
import {User} from 'core/models';
import {NftItem, NftItemInterface} from 'stores/NftStore/models';
import {OdysseyItemInterface} from 'scenes/explore/stores';
import {WalletStatisticsInterface} from 'core/interfaces';

const OnlineUsersStore = types
  .compose(
    ResetModel,
    types.model('OnlineUsersStore', {
      searchWidget: types.optional(Dialog, {}),
      odysseyUsers: types.optional(types.array(User), []),
      allUsers: types.array(User),
      searchedUsers: types.maybe(types.array(User)),
      query: types.maybe(types.string),

      request: types.optional(RequestModel, {}),
      dockRequest: types.optional(RequestModel, {}),
      userRequest: types.optional(RequestModel, {}),

      selectedUserId: types.maybe(types.string),
      nftItem: types.maybe(types.reference(NftItem)),
      nftUser: types.maybeNull(User),
      connections: 0,
      events: 0,
      docks: 0
    })
  )
  .actions((self) => {
    const {getStatisticsByWallet} = getRootStore(self).nftStore;

    return {
      init(worldId: string, userId: string): void {
        this.fetchOdysseyUsers(worldId, userId);
      },
      fetchOdysseyUsers: flow(function* (worldId: string, currentUserId: string) {
        const response: OdysseyOnlineUsersResponse = yield self.request.send(
          api.worldRepository.fetchOnlineUsers,
          {worldId}
        );

        if (response) {
          const currentUser = response.find((user) => user.id === currentUserId);
          if (currentUser) {
            self.allUsers = cast([
              {...currentUser},
              ...response.filter((user) => user.id !== currentUserId)
            ]);
          }

          self.odysseyUsers = cast([...response.filter((user) => user.id !== currentUserId)]);
        }
      }),
      async selectUser(item?: NftItemInterface) {
        if (item?.uuid) {
          const statistics = await getStatisticsByWallet(item.owner);

          this.setNft(item);
          this.setStatistics(statistics);
          this.fetchUser(item.uuid);
          this.fetchEventsCount(item.uuid);
        }
      },
      unselectUser() {
        self.nftUser = null;
        self.nftItem = undefined;
        self.selectedUserId = undefined;
        self.connections = 0;
        self.events = 0;
        self.docks = 0;
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
      setNft(nft: NftItemInterface): void {
        self.selectedUserId = nft.uuid;
        self.nftItem = nft;
      },
      fetchUser: flow(function* (userId: string) {
        const response: UserInterface = yield self.userRequest.send(api.userRepository.fetchUser, {
          userId
        });

        if (response) {
          self.nftUser = cast(response);
        }
      }),
      setStatistics(statistics: WalletStatisticsInterface): void {
        self.connections = statistics.connectionsCount;
        self.docks = statistics.mutualConnectionsCount;
      },
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
    };
  })
  .views((self) => ({
    get odyssey(): OdysseyItemInterface | null {
      if (!self.nftItem) {
        return null;
      }

      return {
        ...self.nftItem,
        connections: self.connections,
        docking: self.docks,
        events: self.events
      };
    }
  }));

export {OnlineUsersStore};
