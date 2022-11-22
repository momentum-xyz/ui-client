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

const ObjectStore = types
  .compose(
    ResetModel,
    types.model('ObjectStore', {
      name: types.maybe(types.string),

      getSpaceInfoRequest: types.optional(RequestModel, {}),
      getAssetRequest: types.optional(RequestModel, {}),

      dynamicScriptsStore: types.optional(DynamicScriptsStore, {}),
      pluginAsset: types.maybe(PluginLoader)
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

      switch (spaceInfo.asset_2d_id) {
        case '952742bd-dabf-4feb-9469-bf5e05f8467d':
          return 'text';
        case '0d5ce8a2-a461-4acd-96df-892708472353':
          return 'image';
        case '86739849-596b-4916-8b53-b554479f2f12':
          return 'video';
        default: {
          if (!assetResponse) {
            return;
          }

          const {options, meta} = assetResponse;

          if (!self.dynamicScriptsStore.containsLoaderWithName(meta.scopeName)) {
            yield self.dynamicScriptsStore.addScript(meta.scopeName, meta.scriptUrl);
          }

          self.pluginAsset = PluginLoader.create({
            id: spaceInfo.asset_2d_id,
            ...options,
            ...meta,
            attributesManager: PluginAttributesManager.create({
              pluginId: meta.pluginId,
              spaceId
            })
          });

          yield self.pluginAsset.loadPlugin();
          return 'plugin';
        }
      }
    })
  }))
  .actions((self) => ({
    init: flow(function* (objectId: string) {
      return yield self.loadAsset2D(objectId);
    }),
    deinit() {
      self.pluginAsset = undefined;
    }
  }));

export {ObjectStore};
