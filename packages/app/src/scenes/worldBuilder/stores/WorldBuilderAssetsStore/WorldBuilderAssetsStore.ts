import {flow, types} from 'mobx-state-tree';
import {Dialog, RequestModel, ResetModel} from '@momentum-xyz/core';

import {api, CreateSpaceWithAssetResponse} from 'api';

const WorldBuilderAssetsStore = types
  .compose(
    ResetModel,
    types.model('WorldBuilderAssetsStore', {
      worldId: types.optional(types.string, ''),
      uploadAssetRequest: types.optional(RequestModel, {}),
      uploadAssetDialog: types.optional(Dialog, {})
    })
  )
  .actions((self) => ({
    init: (worldId: string) => {
      self.worldId = worldId;
    }
  }))
  .actions((self) => ({
    uploadAsset: flow(function* (spaceName: string, asset: File) {
      console.log('uploadAsset', spaceName, asset);
      const response: CreateSpaceWithAssetResponse = yield self.uploadAssetRequest.send(
        api.spaceRepository.createWithAsset,
        {
          name: spaceName,
          worldId: self.worldId,
          asset
        }
      );
      console.log('uploadAsset response', response);
      return !!response;
    })
  }))
  .views((self) => ({
    get isUploadPending() {
      return self.uploadAssetRequest.isPending;
    }
  }));

export {WorldBuilderAssetsStore};
