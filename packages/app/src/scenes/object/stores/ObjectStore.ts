import {types, flow} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum-xyz/core';

import {BasicAsset2dIdEnum} from 'core/enums';
import {PluginAttributesManager, PluginLoader, DynamicScriptList} from 'core/models';
import {
  api,
  Asset2dResponse,
  GetSpaceInfoResponse,
  PluginMetadataInterface,
  PluginOptionsInterface,
  ObjectMetadataInterface,
  ObjectOptionsInterface
} from 'api';

import {AssetStore} from './AssetStore';

const {REACT_APP_LOCAL_PLUGINS = '{}'} = process.env;
const localPlugins = JSON.parse(REACT_APP_LOCAL_PLUGINS);

const ObjectStore = types
  .compose(
    ResetModel,
    types.model('ObjectStore', {
      name: types.maybe(types.string),

      getSpaceInfoRequest: types.optional(RequestModel, {}),
      getAssetRequest: types.optional(RequestModel, {}),

      dynamicScriptList: types.optional(DynamicScriptList, {}),
      asset: types.maybe(PluginLoader),

      assetStore: types.optional(AssetStore, {})
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
        case BasicAsset2dIdEnum.TEXT:
        case BasicAsset2dIdEnum.IMAGE:
        case BasicAsset2dIdEnum.VIDEO: {
          console.info('Its a tile!');
          const objectResponse:
            | Asset2dResponse<ObjectMetadataInterface, ObjectOptionsInterface>
            | undefined = yield self.getAssetRequest.send(api.assetsRepository.get2dAsset, {
            assetId: spaceInfo.asset_2d_id
          });
          if (objectResponse?.meta.pluginId) {
            self.assetStore.setObject(objectResponse, spaceId);
          }
          break;
        }
        case BasicAsset2dIdEnum.DOCK: {
          console.info('Its a dock!');
          const objectResponse:
            | Asset2dResponse<ObjectMetadataInterface, ObjectOptionsInterface>
            | undefined = yield self.getAssetRequest.send(api.assetsRepository.get2dAsset, {
            assetId: spaceInfo.asset_2d_id
          });
          if (objectResponse) {
            self.assetStore.setObject(objectResponse, spaceId);
          }
          break;
        }
        default: {
          let assetData:
            | Asset2dResponse<PluginMetadataInterface, PluginOptionsInterface>
            | undefined = localPlugins[spaceId];

          if (!assetData) {
            assetData = yield self.getAssetRequest.send(api.assetsRepository.get2dAsset, {
              assetId: spaceInfo.asset_2d_id
            });
          } else {
            console.log('Use local PLUGIN assetData for object', spaceId, ':', assetData);
          }

          if (!assetData) {
            return;
          }
          const {options, meta} = assetData;

          if (!self.dynamicScriptList.containsLoaderWithName(meta.scopeName)) {
            yield self.dynamicScriptList.addScript(meta.scopeName, meta.scriptUrl);
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
          self.assetStore.assetType = 'plugin';

          break;
        }
      }
    })
  }))
  .actions((self) => ({
    init: flow(function* (objectId: string) {
      yield self.loadAsset2D(objectId);
    })
  }));

export {ObjectStore};
