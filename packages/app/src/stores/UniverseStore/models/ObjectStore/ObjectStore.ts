import {types, flow} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum-xyz/core';
import {AttributeNameEnum} from '@momentum-xyz/sdk';

import {PluginIdEnum} from 'api/enums';
import {api, GetSpaceInfoResponse} from 'api';
import {BasicAsset2dIdEnum} from 'core/enums';
import {PluginAttributesManager, PluginLoader, DynamicScriptList} from 'core/models';

import {AssetStore} from './models';

const {REACT_APP_LOCAL_PLUGINS = '{}'} = process.env;
const localPlugins = JSON.parse(REACT_APP_LOCAL_PLUGINS);

const ObjectStore = types
  .compose(
    ResetModel,
    types.model('ObjectStore', {
      objectName: types.maybe(types.string),
      asset2dId: types.maybe(types.string),

      objectRequest: types.optional(RequestModel, {}),
      assetRequest: types.optional(RequestModel, {}),
      nameRequest: types.optional(RequestModel, {}),

      dynamicScriptList: types.optional(DynamicScriptList, {}),
      pluginLoader: types.maybe(PluginLoader),

      assetStore: types.optional(AssetStore, {})
    })
  )
  .actions((self) => ({
    initPluginLoader: flow(function* (asset2dId: string, objectId: string) {
      let assetData = localPlugins[objectId];

      console.log('initPluginLoader', asset2dId, objectId, assetData);

      if (!assetData) {
        assetData = yield self.assetRequest.send(api.assets2dRepository.get2dAsset, {
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
      const spaceInfo: GetSpaceInfoResponse | undefined = yield self.objectRequest.send(
        api.spaceInfoRepository.getSpaceInfo,
        {spaceId: objectId}
      );

      if (!spaceInfo) {
        return;
      }

      self.asset2dId = spaceInfo.asset_2d_id;

      switch (self.asset2dId) {
        case BasicAsset2dIdEnum.TEXT:
        case BasicAsset2dIdEnum.IMAGE: {
          const objectResponse = yield self.assetRequest.send(api.assets2dRepository.get2dAsset, {
            assetId: self.asset2dId
          });
          if (objectResponse?.meta.pluginId) {
            self.assetStore.setObject(objectResponse, objectId);
          }
          break;
        }
        default: {
          yield self.initPluginLoader(self.asset2dId, objectId);
          self.assetStore.assetType = 'plugin';
          break;
        }
      }

      if (!self.pluginLoader) {
        yield self.initPluginLoader(BasicAsset2dIdEnum.VIDEO, objectId);
      }
    }),
    fetchObjectName: flow(function* (spaceId: string) {
      const response = yield self.nameRequest.send(api.spaceAttributeRepository.getSpaceAttribute, {
        spaceId: spaceId,
        plugin_id: PluginIdEnum.CORE,
        attribute_name: AttributeNameEnum.NAME
      });

      if (response === undefined || !(AttributeNameEnum.NAME in response)) {
        return;
      }

      self.objectName = response[AttributeNameEnum.NAME];
    })
  }))
  .actions((self) => ({
    init: flow(function* (objectId: string) {
      yield self.loadAsset2D(objectId);
      yield self.fetchObjectName(objectId);

      return self.asset2dId;
    })
  }));

export {ObjectStore};
