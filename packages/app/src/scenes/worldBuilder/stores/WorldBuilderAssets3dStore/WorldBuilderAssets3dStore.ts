import {cast, flow, types} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum-xyz/core';

import {api, FetchAssets3dResponse, UploadAsset3dRequest} from 'api';
import {Asset3dCategoryEnum} from 'api/enums';
import {appVariables} from 'api/constants';
import {Asset3d, Asset3dInterface} from 'core/models';

const WorldBuilderAssets3dStore = types
  .compose(
    ResetModel,
    types.model('WorldBuilderAssets3dStore', {
      worldId: types.optional(types.string, ''),
      uploadProgress: types.maybeNull(types.number),
      selectedAssset: types.maybe(Asset3d),
      objectName: '',
      navigationObjectName: '',
      isVisibleInNavigation: false,

      uploadAssetRequest: types.optional(RequestModel, {}),
      fetchAssets3dRequest: types.optional(RequestModel, {}),
      spawnObjectRequest: types.optional(RequestModel, {}),

      assets3d: types.array(Asset3d)
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
    },
    setObjectName(name: string) {
      self.objectName = name;
    },
    setNavigationObjectName(name: string) {
      self.navigationObjectName = name;
    },
    toggleIsVisibleInNavigation() {
      self.isVisibleInNavigation = !self.isVisibleInNavigation;
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
    }),
    fetchAssets3d: flow(function* (category: Asset3dCategoryEnum) {
      self.assets3d = cast([]);

      const response: FetchAssets3dResponse | undefined = yield self.fetchAssets3dRequest.send(
        api.assets3dRepository.fetchAssets3d,
        {
          category
        }
      );

      if (response) {
        const assets =
          response.map(({id, meta: {name, previewImage}}) => ({
            id,
            name,
            image:
              // FIXME - temp until proper preview images are available
              previewImage
                ? `${appVariables.RENDER_SERVICE_URL}/get/${previewImage}`
                : 'https://dev.odyssey.ninja/api/v3/render/get/03ce359d18bfc0fe977bd66ab471d222'
          })) || [];

        self.assets3d = cast(assets);
      }
    }),
    clearAssets() {
      self.assets3d = cast([]);
    },
    selectAsset(asset: Asset3dInterface) {
      self.selectedAssset = Asset3d.create({...asset});
    },
    spawnObject: flow(function* (worldId: string) {
      yield self.spawnObjectRequest.send(api.spaceRepository.postSpace, {
        parent_id: worldId,
        space_name: self.objectName,
        space_type_id: '4ed3a5bb-53f8-4511-941b-07902982c31c',
        asset_3d_id: self.selectedAssset?.id
      });
    })
  }))
  .views((self) => ({
    get isUploadPending() {
      return self.uploadAssetRequest.isPending;
    }
  }));

export {WorldBuilderAssets3dStore};
