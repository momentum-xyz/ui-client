import {flow, types} from 'mobx-state-tree';
import {Dialog, RequestModel, ResetModel} from '@momentum-xyz/core';

import {api, CreateSpaceWithAssetResponse} from 'api';

const {REACT_APP_ASSET_UPLOAD_TIMEOUT_SEC = '120'} = process.env;
const REQUEST_TIMEOUT_ASSET_UPLOAD_MS = JSON.parse(REACT_APP_ASSET_UPLOAD_TIMEOUT_SEC) * 1000;

const WorldBuilderAssetsStore = types
  .compose(
    ResetModel,
    types.model('WorldBuilderAssetsStore', {
      worldId: types.optional(types.string, ''),
      uploadAssetRequest: types.optional(RequestModel, {}),
      uploadAssetDialog: types.optional(Dialog, {}),
      uploadProgress: types.maybeNull(types.number)
    })
  )
  .actions((self) => ({
    init: (worldId: string) => {
      self.worldId = worldId;
    },
    setUploadProgress: (progress: number) => {
      self.uploadProgress = progress;
    },
    resetUploadProgress: () => {
      self.uploadProgress = null;
    }
  }))
  .actions((self) => ({
    uploadAsset: flow(function* (spaceName: string, asset: File) {
      console.log('uploadAsset', spaceName, asset);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const onUploadProgress = (progressEvent: any) => {
        console.log(progressEvent);
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        self.setUploadProgress(percentCompleted);
      };

      self.setUploadProgress(0);

      const response: CreateSpaceWithAssetResponse = yield self.uploadAssetRequest.send(
        api.spaceRepository.createWithAsset,
        {
          name: spaceName,
          worldId: self.worldId,
          asset,
          timeout: REQUEST_TIMEOUT_ASSET_UPLOAD_MS,
          onUploadProgress
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
