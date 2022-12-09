import {flow, types} from 'mobx-state-tree';
import {Dialog, RequestModel, ResetModel} from '@momentum-xyz/core';
import {ImageSizeEnum} from '@momentum-xyz/ui-kit';

import {NftItem, NftItemInterface} from 'stores/NftStore/models';
import {
  api,
  FetchUserResponse,
  GetDocksCountResponse,
  SpaceAttributeItemResponse,
  UserInterface
} from 'api';
import {appVariables} from 'api/constants';

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
      user: types.maybe(types.frozen<UserInterface>()),
      request: types.optional(RequestModel, {}),
      fetchUserRequest: types.optional(RequestModel, {}),
      nftItem: types.maybe(NftItem),
      nftId: types.maybe(types.string),
      docks: 0,
      events: 0
    })
    .actions((self) => ({
      init(items: Array<NftItemInterface>, worldId: string) {
        this.findOdyssey(items, worldId);
        this.fetchDocksCount(worldId);
        this.fetchEventsCount(worldId);
      },
      findOdyssey(items: Array<NftItemInterface>, worldId: string): void {
        const nft: NftItemInterface | undefined = items.find((nft) => nft.uuid === worldId);
        if (nft) {
          self.nftItem = {...nft};
          this.fetchUser(worldId);
        }
        this.fetchUser(worldId);
        self.nftId = worldId;
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
          return self.nftItem?.image;
        } else {
          return (
            self.user?.profile.avatarHash &&
            `${appVariables.RENDER_SERVICE_URL}/texture/${ImageSizeEnum.S3}/${self.user.profile.avatarHash}`
          );
        }
      }
    }))
);

export {OdysseyStore};
