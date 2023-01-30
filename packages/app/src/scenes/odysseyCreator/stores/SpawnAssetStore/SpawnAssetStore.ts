import {cast, flow, types} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum-xyz/core';
import {ImageSizeEnum} from '@momentum-xyz/ui-kit';
import {SpaceSubOptionKeyEnum} from '@momentum-xyz/sdk';

import {api, FetchAssets3dResponse, PostSpaceResponse, UploadAsset3dRequest} from 'api';
import {Asset3dCategoryEnum} from 'api/enums';
import {appVariables} from 'api/constants';
import {Asset3d, Asset3dInterface, SearchQuery} from 'core/models';

const SpawnAssetStore = types
  .compose(
    ResetModel,
    types.model('SpawnAssetStore', {
      worldId: types.optional(types.string, ''),
      uploadProgress: types.maybeNull(types.number),
      selectedAssset: types.maybe(Asset3d),
      navigationObjectName: '',
      isVisibleInNavigation: false,
      uploadedAssetName: '',
      searchQuery: types.optional(SearchQuery, {}),

      uploadAssetRequest: types.optional(RequestModel, {}),
      fetchAssets3dRequest: types.optional(RequestModel, {}),
      spawnObjectRequest: types.optional(RequestModel, {}),
      setIsVisibleRequest: types.optional(RequestModel, {}),

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
    setNavigationObjectName(name: string) {
      self.navigationObjectName = name;
    },
    setUploadedAssetName(name: string) {
      self.uploadedAssetName = name;
    },
    toggleIsVisibleInNavigation() {
      self.isVisibleInNavigation = !self.isVisibleInNavigation;
    },
    resetSelectedObjectFields() {
      self.navigationObjectName = '';
      self.isVisibleInNavigation = false;
    }
  }))
  .actions((self) => ({
    uploadAsset: flow(function* (asset: File) {
      if (!self.uploadedAssetName) {
        return;
      }

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
          onUploadProgress,
          name: self.uploadedAssetName,
          worldId: self.worldId
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
          category,
          worldId: self.worldId
        }
      );

      if (response) {
        const assets =
          response.map(({id, meta: {name, preview_hash}}) => ({
            id,
            name,
            image:
              // FIXME - temp until proper preview images are available
              preview_hash
                ? `${appVariables.RENDER_SERVICE_URL}/texture/${ImageSizeEnum.S3}/${preview_hash}`
                : `https://dev.odyssey.ninja/api/v3/render/texture/${ImageSizeEnum.S4}/03ce359d18bfc0fe977bd66ab471d222`
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
      const response: PostSpaceResponse | undefined = yield self.spawnObjectRequest.send(
        api.spaceRepository.postSpace,
        {
          parent_id: worldId,
          space_name: self.navigationObjectName,
          // TODO: What is it for? Discussion !!!
          space_type_id: '4ed3a5bb-53f8-4511-941b-07902982c31c',
          asset_3d_id: self.selectedAssset?.id
        }
      );

      if (response) {
        yield self.setIsVisibleRequest.send(api.spaceOptionRepository.setSpaceSubOption, {
          spaceId: response.space_id,
          sub_option_key: SpaceSubOptionKeyEnum.VISIBLE,
          value: self.isVisibleInNavigation ? 3 : 1
        });
      }

      return response?.space_id;
    })
  }))
  .views((self) => ({
    get isUploadPending(): boolean {
      return self.uploadAssetRequest.isPending;
    },
    get filteredAsset3dList(): Asset3dInterface[] {
      return self.searchQuery.isQueryValid
        ? self.assets3d.filter((asset) =>
            asset.name.toLocaleLowerCase().includes(self.searchQuery.queryLowerCased)
          )
        : self.assets3d;
    }
  }));

export {SpawnAssetStore};
