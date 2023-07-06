import {cast, flow, types} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum-xyz/core';
import {ImageSizeEnum} from '@momentum-xyz/ui-kit';

import {api, FetchAssets3dResponse, PostSpaceResponse, UploadAsset3dRequest} from 'api';
import {Asset3dCategoryEnum} from 'api/enums';
import {appVariables} from 'api/constants';
import {Asset3d, Asset3dInterface, SearchQuery} from 'core/models';
import {PosBusService} from 'shared/services';
import {getRootStore} from 'core/utils';

const SpawnAssetStore = types
  .compose(
    ResetModel,
    types.model('SpawnAssetStore', {
      worldId: types.optional(types.string, ''),
      activeTab: 'community',
      uploadProgress: types.maybeNull(types.number),
      selectedAsset: types.maybe(Asset3d),
      navigationObjectName: '',
      isVisibleInNavigation: false,
      uploadedAssetName: '',
      searchQuery: types.optional(SearchQuery, {}),

      uploadAssetRequest: types.optional(RequestModel, {}),
      fetchAssets3dRequest: types.optional(RequestModel, {}),
      spawnObjectRequest: types.optional(RequestModel, {}),
      setIsVisibleRequest: types.optional(RequestModel, {}),

      assets3d: types.array(Asset3d),
      assets3dBasic: types.array(Asset3d),
      assets3dCustom: types.array(Asset3d)
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
    setActiveTab(activeTab: string) {
      self.activeTab = activeTab;
    },
    uploadAsset: flow(function* (
      asset: File,
      preview_hash: string | undefined,
      isPrivate: boolean
    ) {
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
          preview_hash,
          is_private: isPrivate
        }
      );

      console.log('uploadAsset response', response);
      return self.uploadAssetRequest.isDone;
    }),
    uploadImageToMediaManager: flow(function* (file: File) {
      const data = {file: file};
      const userResponse = yield self.uploadAssetRequest.send(
        api.mediaRepository.uploadImage,
        data
      );
      return userResponse?.hash;
    }),
    patchAssetMetadata: flow(function* (
      assetId: string,
      {name, preview_hash}: {name?: string; preview_hash?: string}
    ) {
      const response = yield self.uploadAssetRequest.send(
        api.assets3dRepository.patchAssets3dMetadata,
        {
          assetId,
          name,
          preview_hash
        }
      );
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
          response
            .map(({id, meta: {name = id, preview_hash, category}, is_private}) => ({
              id,
              category,
              name,
              preview_hash,
              is_private,
              image:
                // FIXME - temp until proper preview images are available
                preview_hash
                  ? `${appVariables.RENDER_SERVICE_URL}/texture/${ImageSizeEnum.S3}/${preview_hash}`
                  : `https://dev.odyssey.ninja/api/v3/render/texture/${ImageSizeEnum.S4}/03ce359d18bfc0fe977bd66ab471d222`
            }))
            .sort((a, b) => a.name.localeCompare(b.name)) || [];

        self.assets3d = cast(assets);
        if (category === Asset3dCategoryEnum.BASIC) {
          self.assets3dBasic = cast(assets);
        } else if (category === Asset3dCategoryEnum.CUSTOM) {
          self.assets3dCustom = cast(assets);
        }
      }
    }),
    fetchAllAssets3d: flow(function* () {
      yield self.fetchAssets3d(Asset3dCategoryEnum.BASIC);
      yield self.fetchAssets3d(Asset3dCategoryEnum.CUSTOM);
    }),
    clearAssets() {
      self.assets3d = cast([]);
      self.searchQuery.resetModel();
    },
    selectAsset(asset: Asset3dInterface | null) {
      self.selectedAsset = asset ? Asset3d.create({...asset}) : undefined;
    },
    spawnObject: flow(function* (worldId: string) {
      // it's pretty ugly solution but having 2 comm channels (API and WS) leads to possibility of race condition
      // and it's not clear after we receive response here whether we've already received it from WS or not
      // and babylon module is not currently flexible enough to handle this situation
      PosBusService.attachNextReceivedObjectToCamera = true;

      const response: PostSpaceResponse | undefined = yield self.spawnObjectRequest.send(
        // TODO rename SPACE to OBJECT
        api.spaceRepository.postSpace,
        {
          parent_id: worldId,
          object_name: self.navigationObjectName,
          // TODO: What is it for? Discussion !!!
          object_type_id: '4ed3a5bb-53f8-4511-941b-07902982c31c',
          asset_3d_id: self.selectedAsset?.id,
          minimap: self.isVisibleInNavigation
        }
      );
      const objectId = response?.object_id;

      if (objectId) {
        getRootStore(self).universeStore.world3dStore?.closeAndResetObjectMenu();
        getRootStore(self).universeStore.world3dStore?.setAttachedToCamera(objectId);
      }

      return objectId;
    })
  }))
  .views((self) => ({
    get isUploadPending(): boolean {
      return self.uploadAssetRequest.isPending;
    },
    filteredAsset3dList(category: string, isPrivate = false): Asset3dInterface[] {
      const assets3dList =
        category === Asset3dCategoryEnum.BASIC
          ? self.assets3dBasic
          : self.assets3dCustom.filter((asset) => asset.is_private === isPrivate);
      return self.searchQuery.isQueryValid
        ? assets3dList.filter((asset) =>
            asset.name.toLocaleLowerCase().includes(self.searchQuery.queryLowerCased)
          )
        : assets3dList;
    }
  }));

export {SpawnAssetStore};
