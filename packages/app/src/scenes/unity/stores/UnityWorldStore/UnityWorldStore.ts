import {flow, types, cast} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum-xyz/core';

import {
  api,
  WorldConfigType,
  WorldConfigResponse,
  SpaceAttributeItemResponse,
  SpaceInterface
} from 'api';
import {mapper} from 'api/mapper';
import {NftItemModelInterface, Space} from 'core/models';
import {getImageAbsoluteUrl, getRootStore} from 'core/utils';

// TODO: Use this store a little bit more :)
const UnityWorldStore = types.compose(
  ResetModel,
  types
    .model('UnityWorldStore', {
      worldId: types.optional(types.string, ''),
      world: types.maybeNull(Space),
      worldConfigRequest: types.optional(RequestModel, {}),
      worldInformationRequest: types.optional(RequestModel, {}),
      worldConfig: types.maybe(types.frozen<WorldConfigType>())
    })
    .actions((self) => ({
      init(worldId: string) {
        self.worldId = worldId;
        //self.fetchWorldConfig(worldId);
        this.fetchWorldInformation(worldId);
      },
      fetchWorldConfig: flow(function* (worldId: string) {
        const response: WorldConfigResponse = yield self.worldConfigRequest.send(
          api.spaceRepositoryOld.fetchWorldConfig,
          {worldId}
        );

        if (response) {
          self.worldConfig = cast(response);
        }
      }),
      fetchWorldInformation: flow(function* (spaceId: string) {
        const response: SpaceAttributeItemResponse = yield self.worldInformationRequest.send(
          api.spaceRepository.fetchSpace,
          {spaceId}
        );

        if (response) {
          self.world = cast({
            id: spaceId,
            ...mapper.mapSpaceSubAttributes<SpaceInterface>(response)
          });
        }
      })
    }))
    .views((self) => ({
      get isMyWorld(): boolean {
        return self.worldId === getRootStore(self).sessionStore.userId;
      }
    }))
    .views((self) => ({
      get isCurrentUserWorldAdmin(): boolean {
        if (self.isMyWorld) {
          return true;
        }
        const worldNft = getRootStore(self).nftStore.getNftByUuid(self.worldId);
        return worldNft?.owner
          ? getRootStore(self).nftStore.mutualStakingAddresses.includes(worldNft.owner)
          : false;
      },
      get worldImageSrc(): string {
        const worldNft = getRootStore(self).nftStore.getNftByUuid(self.worldId);
        return worldNft?.image ? getImageAbsoluteUrl(worldNft.image) || '' : '';
      },
      get nftOfWorld(): NftItemModelInterface | undefined {
        return getRootStore(self).nftStore.getNftByUuid(self.worldId);
      }
    }))
);

export {UnityWorldStore};
