import {flow, types, cast} from 'mobx-state-tree';
import {Event3dEmitter, RequestModel, ResetModel} from '@momentum-xyz/core';

import {api, SpaceAttributeItemResponse, SpaceInterface} from 'api';
import {mapper} from 'api/mapper';
import {NftItemModelInterface, Object, UserDetails, WorldInfo} from 'core/models';
import {getImageAbsoluteUrl, getRootStore} from 'core/utils';

const World2dStore = types.compose(
  ResetModel,
  types
    .model('World2dStore', {
      worldId: types.optional(types.string, ''),
      worldInfo: types.maybeNull(WorldInfo),
      onlineUsersList: types.optional(types.array(UserDetails), []),

      // TODO: Removal
      request: types.optional(RequestModel, {}),
      info: types.maybeNull(Object)
    })
    .actions((self) => ({
      init(worldId: string) {
        self.worldId = worldId;
        this.loadWorld();
        this.subscribeToUsers();
      },
      loadWorld(): void {
        // TODO: Implementation
        // self.worldInfo = ...
      },
      subscribeToUsers(): void {
        Event3dEmitter.on('UserAdded', (onlineUser) => {
          this.addOnlineUser(onlineUser.id);
        });
        Event3dEmitter.on('UserRemoved', (userId) => {
          this.removeOnlineUser(userId);
        });
      },
      addOnlineUser(userId: string) {
        const userDetails = UserDetails.create({userId});
        self.onlineUsersList = cast([...self.onlineUsersList, userDetails]);
      },
      removeOnlineUser(userId: string) {
        self.onlineUsersList = cast([
          ...self.onlineUsersList.filter((user) => user.userId !== userId)
        ]);
      },
      // TODO: Removal
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
