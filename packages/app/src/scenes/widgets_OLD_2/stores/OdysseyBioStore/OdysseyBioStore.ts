import {cast, flow, types} from 'mobx-state-tree';
import {Dialog, RequestModel, ResetModel} from '@momentum-xyz/core';

import {getRootStore} from 'core/utils';
import {User} from 'core/models';
import {WalletStatisticsInterface} from 'core/interfaces';
import {api, SpaceAttributeItemResponse, UserInterface} from 'api';
import {NftItem, NftItemModelInterface, NftItemStatsModelInterface} from 'core/models';
import {appVariables} from 'api/constants';

const OdysseyBioStore = types.compose(
  ResetModel,
  types
    .model('OdysseyBioStore', {
      dialog: types.optional(Dialog, {}),
      request: types.optional(RequestModel, {}),
      userRequest: types.optional(RequestModel, {}),
      nftId: types.maybe(types.string),
      nftItem: types.maybe(types.reference(NftItem)),
      nftUser: types.maybeNull(User),
      connections: 0,
      events: 0,
      docks: 0
    })
    .actions((self) => {
      const {getStatisticsByWallet, getNftByUuid} = getRootStore(self).nftStore;

      return {
        async open(uuid?: string) {
          const item = getNftByUuid(uuid || '');
          if (!item) {
            return;
          }
          const statistics = await getStatisticsByWallet(item.owner);

          this.setNft(item);
          this.fetchUser(item.uuid);
          this.setStatistics(statistics);
          this.fetchEventsCount(item.uuid);

          self.dialog.open();
        },
        setNft(nft: NftItemModelInterface): void {
          self.nftId = nft.uuid;
          self.nftItem = nft;
        },
        setStatistics(statistics: WalletStatisticsInterface): void {
          self.connections = statistics.connectionsCount;
          self.docks = statistics.mutualConnectionsCount;
        },
        fetchUser: flow(function* (userId: string) {
          const response: UserInterface = yield self.userRequest.send(
            api.userRepository.fetchUser,
            {userId}
          );

          if (response) {
            self.nftUser = cast(response);
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
      };
    })
    .views((self) => ({
      get odyssey(): NftItemStatsModelInterface | null {
        if (!self.nftItem) {
          return null;
        }

        return {
          ...self.nftItem,
          connections: self.connections,
          docking: self.docks,
          events: self.events
        };
      },
      get isOnOdysseyWorld(): boolean {
        return self.nftId === appVariables.ODYSSEY_WORLD_ID;
      }
    }))
);

export {OdysseyBioStore};