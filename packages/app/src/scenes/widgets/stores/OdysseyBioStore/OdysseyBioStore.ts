import {flow, types} from 'mobx-state-tree';
import {Dialog, RequestModel, ResetModel} from '@momentum-xyz/core';

import {getRootStore} from 'core/utils';
import {WalletStatisticsInterface} from 'core/interfaces';
import {api, SpaceAttributeItemResponse} from 'api';
import {NftItem, NftItemInterface} from 'stores/NftStore/models';

export interface OdysseyItemInterface extends NftItemInterface {
  connections: number;
  docking: number;
  events: number;
}

const OdysseyBioStore = types.compose(
  ResetModel,
  types
    .model('OdysseyBioStore', {
      widget: types.optional(Dialog, {}),
      request: types.optional(RequestModel, {}),
      nftId: types.maybe(types.string),
      nftItem: types.maybe(types.reference(NftItem)),
      connections: 0,
      events: 0,
      docks: 0
    })
    .actions((self) => {
      const {getStatisticsByWallet} = getRootStore(self).nftStore;

      return {
        async open(item?: NftItemInterface) {
          if (item?.uuid) {
            const statistics = await getStatisticsByWallet(item.owner);

            this.setNft(item);
            this.setStatistics(statistics);
            this.fetchEventsCount(item.uuid);

            self.widget.open();
          }
        },
        setNft(nft: NftItemInterface): void {
          self.nftId = nft.uuid;
          self.nftItem = nft;
        },
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
    }))
);

export {OdysseyBioStore};
