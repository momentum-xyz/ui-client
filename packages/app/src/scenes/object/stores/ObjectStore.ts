import {types, flow} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum-xyz/core';
import {AttributeNameEnum} from '@momentum-xyz/sdk';

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
import {PluginIdEnum} from 'api/enums';

import {AssetStore} from './AssetStore';

const {REACT_APP_LOCAL_PLUGINS = '{}'} = process.env;
const localPlugins = JSON.parse(REACT_APP_LOCAL_PLUGINS);

const ObjectStore = types
  .compose(
    ResetModel,
    types.model('ObjectStore', {
      objectName: types.maybe(types.string),
      currentAssetId: types.maybe(types.string),

      getSpaceInfoRequest: types.optional(RequestModel, {}),
      getAssetRequest: types.optional(RequestModel, {}),
      getObjectNameRequest: types.optional(RequestModel, {}),

      dynamicScriptList: types.optional(DynamicScriptList, {}),
      pluginLoader: types.maybe(PluginLoader),

      assetStore: types.optional(AssetStore, {})
    })
  )
  .actions((self) => ({
    initPluginLoader: flow(function* (asset2dId: string, objectId: string) {
      let assetData: Asset2dResponse<PluginMetadataInterface, PluginOptionsInterface> | undefined =
        localPlugins[objectId];
      console.log('initPluginLoader', asset2dId, objectId, assetData);

      if (!assetData) {
        assetData = yield self.getAssetRequest.send(api.assets2dRepository.get2dAsset, {
          assetId: asset2dId
        });
      } else {
        console.log('Use local PLUGIN assetData for object', objectId, ':', assetData);
      }

      if (!assetData) {
        return;
      }
      const {options, meta} = assetData;

      if (!self.dynamicScriptList.containsLoaderWithName(meta.scopeName)) {
        yield self.dynamicScriptList.addScript(meta.scopeName, meta.scriptUrl);
      }

      self.pluginLoader = PluginLoader.create({
        id: asset2dId,
        ...options,
        ...meta,
        attributesManager: PluginAttributesManager.create({
          pluginId: meta.pluginId,
          spaceId: objectId
        })
      });

      yield self.pluginLoader.loadPlugin();
    })
  }))
  .actions((self) => ({
    loadAsset2D: flow(function* (objectId: string) {
      const spaceInfo: GetSpaceInfoResponse | undefined = yield self.getSpaceInfoRequest.send(
        api.spaceInfoRepository.getSpaceInfo,
        {spaceId: objectId}
      );

      self.currentAssetId = spaceInfo?.asset_2d_id;

      if (!spaceInfo) {
        return;
      }

      switch (spaceInfo.asset_2d_id) {
        // case BasicAsset2dIdEnum.VIDEO:
        case BasicAsset2dIdEnum.TEXT:
        case BasicAsset2dIdEnum.IMAGE: {
          console.info('Its a tile!');
          const objectResponse:
            | Asset2dResponse<ObjectMetadataInterface, ObjectOptionsInterface>
            | undefined = yield self.getAssetRequest.send(api.assets2dRepository.get2dAsset, {
            assetId: spaceInfo.asset_2d_id
          });
          // FIXME: It is incorrect (by Nikita).
          // FIXME: It should be objectResponse?.pluginId
          if (objectResponse?.meta.pluginId) {
            self.assetStore.setObject(objectResponse, objectId);
          }
          break;
        }
        case BasicAsset2dIdEnum.DOCK: {
          console.info('Its a dock!');
          const objectResponse:
            | Asset2dResponse<ObjectMetadataInterface, ObjectOptionsInterface>
            | undefined = yield self.getAssetRequest.send(api.assets2dRepository.get2dAsset, {
            assetId: spaceInfo.asset_2d_id
          });
          if (objectResponse) {
            self.assetStore.setObject(objectResponse, objectId);
          }
          break;
        }
        default: {
          yield self.initPluginLoader(spaceInfo.asset_2d_id, objectId);

          self.assetStore.assetType = 'plugin';
          break;
        }
      }

      if (!self.pluginLoader) {
        yield self.initPluginLoader(BasicAsset2dIdEnum.VIDEO, objectId);
      }
    }),
    fetchObjectName: flow(function* (spaceId: string) {
      const attributeName = AttributeNameEnum.NAME;
      const response = yield self.getObjectNameRequest.send(
        api.spaceAttributeRepository.getSpaceAttribute,
        {
          spaceId: spaceId,
          plugin_id: PluginIdEnum.CORE,
          attribute_name: attributeName
        }
      );

      if (response === undefined || !(attributeName in response)) {
        return;
      }

      self.objectName = response[attributeName];
    })
  }))
  .actions((self) => ({
    init: flow(function* (objectId: string) {
      yield self.loadAsset2D(objectId);
      yield self.fetchObjectName(objectId);

      return self.currentAssetId;
    })
  }))
  .views((self) => ({
    get isPending() {
      return (
        self.getSpaceInfoRequest.isPending ||
        self.getAssetRequest.isPending ||
        self.getObjectNameRequest.isPending
      );
    }
  }));

export {ObjectStore};
