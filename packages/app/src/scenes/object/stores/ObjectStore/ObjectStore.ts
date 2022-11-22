import {types, flow} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum-xyz/core';

import {PluginAttributesManager, PluginLoader} from 'core/models';
import {
  api,
  Asset2DResponse,
  GetSpaceInfoResponse,
  PluginMetadataInterface,
  PluginOptionsInterface
} from 'api';
import {DynamicScriptsStore} from 'stores/MainStore/models';
import {AssetTypeEnum} from 'core/enums';

const ObjectStore = types
  .compose(
    ResetModel,
    types.model('ObjectStore', {
      name: types.maybe(types.string),

      getSpaceInfoRequest: types.optional(RequestModel, {}),
      getAssetRequest: types.optional(RequestModel, {}),

      dynamicScriptsStore: types.optional(DynamicScriptsStore, {}),
      asset: types.maybe(PluginLoader)
    })
  )
  .actions((self) => ({
    loadAsset2D: flow(function* (spaceId: string) {
      const spaceInfo: GetSpaceInfoResponse | undefined = yield self.getSpaceInfoRequest.send(
        api.spaceInfoRepository.getSpaceInfo,
        {spaceId}
      );

      if (!spaceInfo) {
        return;
      }

      const assetResponse:
        | Asset2DResponse<PluginMetadataInterface, PluginOptionsInterface>
        | undefined = yield self.getAssetRequest.send(api.assetsRepository.get2DAsset, {
        assetId: spaceInfo.asset_2d_id
      });

      if (!assetResponse) {
        return;
      }

      const {options, meta} = assetResponse;

      meta.scriptUrl = 'http://localhost:3001/remoteEntry.js';

      if (!self.dynamicScriptsStore.containsLoaderWithName(meta.scopeName)) {
        yield self.dynamicScriptsStore.addScript(meta.scopeName, meta.scriptUrl);
      }

      self.asset = PluginLoader.create({
        id: spaceInfo.asset_2d_id,
        ...options,
        ...meta,
        attributesManager: PluginAttributesManager.create({
          pluginId: spaceInfo.asset_2d_id,
          spaceId
        })
      });

      yield self.asset.loadPlugin();
    })
  }))
  .actions((self) => ({
    init: flow(function* (objectId: string, assetType: AssetTypeEnum) {
      switch (assetType) {
        case AssetTypeEnum.PLUGIN:
          yield self.loadAsset2D(objectId);
          break;
        case AssetTypeEnum.TEXT:
          // TODO: Open text tile
          break;
        case AssetTypeEnum.IMAGE:
          // TODO: Open image tile
          break;
        case AssetTypeEnum.VIDEO:
          // TODO: Open video tile
          break;
      }
    })
  }));

export {ObjectStore};
