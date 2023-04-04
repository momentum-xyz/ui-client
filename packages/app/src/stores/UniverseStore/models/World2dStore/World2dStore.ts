import {flow, types, cast} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum-xyz/core';

import {api, SpaceAttributeItemResponse, SpaceInterface} from 'api';
import {mapper} from 'api/mapper';
import {NftItemModelInterface, Object} from 'core/models';
import {getImageAbsoluteUrl, getRootStore} from 'core/utils';

const World2dStore = types.compose(
  ResetModel,
  types
    .model('World2dStore', {
      worldId: types.optional(types.string, ''),
      info: types.maybeNull(Object),
      request: types.optional(RequestModel, {})
      // TODO: onlineUsersList: array
    })
    .actions((self) => ({
      init(worldId: string) {
        self.worldId = worldId;
        this.fetchWorldInformation(worldId);
      },
      fetchWorldInformation: flow(function* (spaceId: string) {
        const response: SpaceAttributeItemResponse = yield self.request.send(
          api.spaceRepository.fetchSpace,
          {spaceId}
        );

        if (response) {
          self.info = cast({
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

export {World2dStore};
