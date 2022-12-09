import {cast, flow, types} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum-xyz/core';

import {api, GetDocksCountResponse, SpaceAttributeItemResponse} from 'api';
import {getImageAbsoluteUrl} from 'core/utils';
import {NftItem, NftItemInterface} from 'stores/NftStore/models';
import {OdysseyItemInterface} from 'scenes/explore/stores';

const Map3dStore = types
  .compose(
    ResetModel,
    types.model('Map3dStore', {
      request: types.optional(RequestModel, {}),
      selectedNft: types.maybeNull(types.reference(NftItem)),
      events: 0,
      docks: 0
    })
  )
  .actions((self) => ({
    selectOdyssey(item: NftItemInterface): void {
      self.selectedNft = cast(item);
      this.fetchDocksCount(item.uuid);
      this.fetchEventsCount(item.uuid);
    },
    unselectOdyssey(): void {
      self.selectedNft = null;
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
    get selectedOdyssey(): OdysseyItemInterface | null {
      if (!self.selectedNft) {
        return null;
      }

      return {
        ...self.selectedNft,
        image: getImageAbsoluteUrl(self.selectedNft.image) || '',
        connections: 0,
        docking: self.docks,
        events: self.events
      };
    }
  }));

export {Map3dStore};
