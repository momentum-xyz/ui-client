import {flow, types} from 'mobx-state-tree';
import {Dialog, RequestModel, ResetModel} from '@momentum-xyz/core';

import {NftItem, NftItemInterface} from 'stores/NftStore/models';
import {api, GetDocksCountResponse} from 'api';

export interface OdysseyItemInterface extends NftItemInterface {
  connections: number;
  docking: number;
  events: number;
}

const OdysseyStore = types.compose(
  ResetModel,
  types
    .model('OdysseyStore', {
      widget: types.optional(Dialog, {}),
      request: types.optional(RequestModel, {}),
      nftItem: types.maybe(NftItem),
      nftId: types.maybe(types.string),
      docks: types.maybe(types.number)
    })
    .actions((self) => ({
      init(items: Array<NftItemInterface>, worldId: string) {
        this.findOdyssey(items, worldId);
        this.fetchEventsCount(worldId);
      },
      findOdyssey(items: Array<NftItemInterface>, worldId: string): void {
        const nft: NftItemInterface | undefined = items.find((nft) => nft.uuid === worldId);
        if (nft) {
          self.nftItem = {...nft};
        }
        self.nftId = worldId;
      },
      fetchEventsCount: flow(function* (spaceId: string) {
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
    }))
);

export {OdysseyStore};
