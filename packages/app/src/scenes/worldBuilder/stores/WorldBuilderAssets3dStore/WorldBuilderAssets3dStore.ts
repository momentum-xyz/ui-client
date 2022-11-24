import {flow, types} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum-xyz/core';

import {api, UploadAsset3dRequest} from 'api';

const WorldBuilderAssets3dStore = types
  .compose(
    ResetModel,
    types.model('WorldBuilderAssets3dStore', {
      worldId: types.optional(types.string, ''),
      uploadAssetRequest: types.optional(RequestModel, {}),
      uploadProgress: types.maybeNull(types.number)
    })
  )
  .actions((self) => ({
    init: (worldId: string) => {
      self.worldId = worldId;
    },
    setUploadProgress: (progress: number) => {
      self.uploadProgress = progress;
    }
  }))
  .actions((self) => ({
    uploadAsset: flow(function* (asset: File) {
      console.log('uploadAsset', asset);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const onUploadProgress = (progressEvent: any) => {
        console.log(progressEvent);
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        self.setUploadProgress(percentCompleted);
      };

      self.setUploadProgress(0);

      const response: UploadAsset3dRequest = yield self.uploadAssetRequest.send(
        api.assets3dRepository.upload3DAsset,
        {
          asset,
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

export {WorldBuilderAssets3dStore};
