import {types, flow} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum-xyz/core';

import {PluginAttributesManager, PluginLoader} from 'core/models';
import {
  api,
  Asset2dResponse,
  GetSpaceInfoResponse,
  PluginMetadataInterface,
  PluginOptionsInterface,
  ObjectMetadataInterface,
  ObjectOptionsInterface
} from 'api';
import {DynamicScriptsStore} from 'stores/MainStore/models';
import {ObjectTypeEnum} from 'core/enums';

import {TileStore} from './TileStore';

const ObjectStore = types
  .compose(
    ResetModel,
    types.model('ObjectStore', {
      name: types.maybe(types.string),

      getSpaceInfoRequest: types.optional(RequestModel, {}),
      getAssetRequest: types.optional(RequestModel, {}),

      dynamicScriptsStore: types.optional(DynamicScriptsStore, {}),
      asset: types.maybe(PluginLoader),

      tileStore: types.optional(TileStore, {})
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

      switch (spaceInfo.asset_2d_id) {
        case ObjectTypeEnum.TEXT:
        case ObjectTypeEnum.IMAGE:
        case ObjectTypeEnum.VIDEO: {
          console.info('Its a tile!');
          const objectResponse:
            | Asset2dResponse<ObjectMetadataInterface, ObjectOptionsInterface>
            | undefined = yield self.getAssetRequest.send(api.assetsRepository.get2dAsset, {
            assetId: spaceInfo.asset_2d_id
          });
          if (objectResponse?.meta.pluginId) {
            self.tileStore.setObject(objectResponse, spaceId, objectResponse.meta.pluginId);
          }
          break;
        }
        default: {
          const assetResponse:
            | Asset2dResponse<PluginMetadataInterface, PluginOptionsInterface>
            | undefined = yield self.getAssetRequest.send(api.assetsRepository.get2dAsset, {
            assetId: spaceInfo.asset_2d_id
          });

          if (!assetResponse) {
            return;
          }
          const {options, meta} = assetResponse;

          if (!self.dynamicScriptsStore.containsLoaderWithName(meta.scopeName)) {
            yield self.dynamicScriptsStore.addScript(meta.scopeName, meta.scriptUrl);
          }

          self.asset = PluginLoader.create({
            id: spaceInfo.asset_2d_id,
            ...options,
            ...meta,
            attributesManager: PluginAttributesManager.create({
              pluginId: meta.pluginId,
              spaceId
            })
          });

          yield self.asset.loadPlugin();
          self.tileStore.assetType = 'plugin';

          break;
        }
      }
    })
  }))
  .actions((self) => ({
    init: flow(function* (objectId: string) {
      yield self.loadAsset2D(objectId);
    }),
    deinit() {
      self.asset = undefined;
    }
  }));

export {ObjectStore};
