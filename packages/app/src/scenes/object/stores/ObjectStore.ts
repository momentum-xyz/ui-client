import {types, flow} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum-xyz/core';

import {PluginAttributesManager, PluginLoader} from 'core/models';
import {
  api,
  Asset2DResponse,
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

      // TODO: should be check based on 2d asset id : spaceId --> spaceInfo.asset_2d_id
      switch (spaceId) {
        case ObjectTypeEnum.TEXT:
        case ObjectTypeEnum.IMAGE:
        case ObjectTypeEnum.VIDEO: {
          const objectResponse:
            | Asset2DResponse<ObjectMetadataInterface, ObjectOptionsInterface>
            | undefined = yield self.getAssetRequest.send(api.assetsRepository.get2DAsset, {
            assetId: spaceInfo.asset_2d_id
          });
          self.tileStore.setObject(objectResponse, spaceId);
          break;
        }
        default: {
          const assetResponse:
            | Asset2DResponse<PluginMetadataInterface, PluginOptionsInterface>
            | undefined = yield self.getAssetRequest.send(api.assetsRepository.get2DAsset, {
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
