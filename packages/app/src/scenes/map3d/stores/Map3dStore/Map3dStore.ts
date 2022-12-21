import {cast, flow, types} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum-xyz/core';

import {api, SpaceAttributeItemResponse} from 'api';
import {getImageAbsoluteUrl} from 'core/utils';
import {NftItem, NftItemInterface} from 'stores/NftStore/models';
import {OdysseyItemInterface} from 'scenes/explore/stores';
import {WalletStatisticsInterface} from 'core/interfaces';

const Map3dStore = types
  .compose(
    ResetModel,
    types.model('Map3dStore', {
      request: types.optional(RequestModel, {}),
      selectedNft: types.maybeNull(types.reference(NftItem)),
      connections: 0,
      events: 0,
      docks: 0
    })
  )
  .actions((self) => ({
    selectOdyssey(item: NftItemInterface, statistics: WalletStatisticsInterface): void {
      self.selectedNft = cast(item);
      self.connections = statistics.connectionsCount;
      self.docks = statistics.mutualConnectionsCount;
      this.fetchEventsCount(item.uuid);
    },
    unselectOdyssey(): void {
      self.selectedNft = null;
      self.connections = 0;
      self.events = 0;
      self.docks = 0;
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
  }))
  .views((self) => ({
    get selectedOdyssey(): OdysseyItemInterface | null {
      if (!self.selectedNft) {
        return null;
      }

      return {
        ...self.selectedNft,
        image: getImageAbsoluteUrl(self.selectedNft.image) || '',
        connections: self.connections,
        docking: self.docks,
        events: self.events
      };
    }
  }));

export {Map3dStore};
