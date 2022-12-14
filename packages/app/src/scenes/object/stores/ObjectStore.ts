import {types, flow} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum-xyz/core';
import {AttributeNameEnum} from '@momentum-xyz/sdk';

import {PluginAttributesManager, PluginLoader} from 'core/models';
import {
  api,
  Asset2dResponse,
  GetSpaceInfoResponse,
  PluginMetadataInterface,
  PluginOptionsInterface,
  ObjectMetadataInterface,
  ObjectOptionsInterface,
  ObjectInterface,
  UploadImageResponse
} from 'api';
import {DynamicScriptsStore} from 'stores/MainStore/models';
import {ObjectTypeEnum} from 'core/enums';

import {TileStore} from './TileStore';

const ObjectStore = types
  .compose(
    ResetModel,
    types.model('ObjectStore', {
      name: types.maybe(types.string),

      textTileContent: types.maybe(types.frozen<{title: string; content: string}>()),
      videoTileContent: types.maybe(types.frozen<{youtubeUrl: string}>()),
      imageTileContent: types.maybe(types.frozen<{src: string}>()),

      getSpaceInfoRequest: types.optional(RequestModel, {}),
      getAssetRequest: types.optional(RequestModel, {}),

      imageUpload: types.optional(RequestModel, {}),
      setTileRequest: types.optional(RequestModel, {}),

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
    }),
    postNewImage: flow(function* (objectId: string, file: File) {
      if (!self.tileStore.pluginId) {
        return;
      }
      const data = {file: file};
      const userResponse: UploadImageResponse = yield self.imageUpload.send(
        api.mediaRepository.uploadImage,
        data
      );
      const imageHash = userResponse?.hash;

      yield self.setTileRequest.send(api.spaceAttributeRepository.setSpaceAttribute, {
        spaceId: objectId,
        plugin_id: self.tileStore.pluginId,
        attribute_name: AttributeNameEnum.STATE,
        value: {render_hash: imageHash}
      });

      yield self.tileStore.getSpaceAttributeValue(self.tileStore.pluginId, objectId);
    }),
    postNewContent: flow(function* (objectId: string, content: ObjectInterface) {
      if (!self.tileStore.pluginId) {
        return;
      }

      yield self.setTileRequest.send(api.spaceAttributeRepository.setSpaceAttribute, {
        spaceId: objectId,
        plugin_id: self.tileStore.pluginId,
        attribute_name: AttributeNameEnum.STATE,
        value: content
      });

      yield self.tileStore.getSpaceAttributeValue(self.tileStore.pluginId, objectId);
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
