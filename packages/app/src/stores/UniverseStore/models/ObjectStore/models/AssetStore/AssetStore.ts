import {flow, types} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum-xyz/core';
import {ImageSizeEnum} from '@momentum-xyz/ui-kit';
import {AttributeNameEnum} from '@momentum-xyz/sdk';

import {PluginIdEnum} from 'api/enums';
import {AssetTypeEnum} from 'core/enums';
import {getImageAbsoluteUrl} from 'core/utils';
import {
  api,
  Asset2dResponse,
  GetObjectResponse,
  ObjectInterface,
  ObjectMetadataInterface,
  ObjectOptionsInterface,
  UploadFileResponse
} from 'api';

const AssetStore = types
  .compose(
    ResetModel,
    types.model('AssetStore', {
      assetType: types.maybe(types.string),
      content: types.maybe(types.frozen<ObjectInterface>()),
      pluginId: types.maybe(types.string),

      request: types.optional(RequestModel, {}),
      imageUpload: types.optional(RequestModel, {}),
      setTileRequest: types.optional(RequestModel, {})
    })
  )
  .actions((self) => ({
    getSpaceAttributeValue: flow(function* (pluginId: string, spaceId: string) {
      const response: GetObjectResponse = yield self.request.send(
        api.objectRepository.fetchObject,
        {
          spaceId,
          pluginId
        }
      );

      if (response) {
        self.content = response;
      }
    })
    /*getDockInfo: flow(function* (spaceId: string) {
      const worldResponse: GetSpaceAttributeResponse | undefined = yield self.request.send(
        api.spaceAttributeRepository.getSpaceAttribute,
        {
          spaceId,
          plugin_id: PluginIdEnum.CORE,
          attribute_name: AttributeNameEnum.TELEPORT
        }
      );

      if (worldResponse) {
        self.dockWorldId = worldResponse['DestinationWorldID'] as string | undefined;
      }
    })*/
  }))
  .actions((self) => ({
    setObject(
      object: Asset2dResponse<ObjectMetadataInterface, ObjectOptionsInterface> | undefined,
      spaceId: string
    ) {
      console.log('AssetStore setObject', object, spaceId);
      if (!object) {
        return;
      }
      const {meta} = object;
      self.pluginId = meta.pluginId;

      switch (meta.name) {
        case AssetTypeEnum.TEXT:
          self.assetType = AssetTypeEnum.TEXT;
          self.getSpaceAttributeValue(meta.pluginId, spaceId);
          break;
        case AssetTypeEnum.IMAGE:
          self.assetType = AssetTypeEnum.IMAGE;
          self.getSpaceAttributeValue(meta.pluginId, spaceId);
          break;
        /*case AssetTypeEnum.DOCK:
          self.assetType = AssetTypeEnum.DOCK;
          self.getDockInfo(spaceId);
          break;*/
        default:
          break;
      }
    },
    postNewImage: flow(function* (objectId: string, file: File, title?: string) {
      const userResponse: UploadFileResponse = yield self.imageUpload.send(
        api.mediaRepository.uploadImage,
        {file}
      );
      const imageHash = userResponse?.hash;

      yield self.setTileRequest.send(api.spaceAttributeRepository.setSpaceAttribute, {
        spaceId: objectId,
        plugin_id: PluginIdEnum.IMAGE,
        attribute_name: AttributeNameEnum.STATE,
        value: {render_hash: imageHash, title}
      });

      yield self.getSpaceAttributeValue(PluginIdEnum.IMAGE, objectId);
    }),
    postNewContent: flow(function* (objectId: string, content: ObjectInterface) {
      yield self.setTileRequest.send(api.spaceAttributeRepository.setSpaceAttribute, {
        spaceId: objectId,
        plugin_id: PluginIdEnum.TEXT,
        attribute_name: AttributeNameEnum.STATE,
        value: content
      });

      yield self.getSpaceAttributeValue(PluginIdEnum.TEXT, objectId);
    }),
    deleteFunction: flow(function* (objectId: string, pluginId: PluginIdEnum) {
      // yield self.setTileRequest.send(api.spaceAttributeRepository.setSpaceAttribute, {
      //   spaceId: objectId,
      //   plugin_id: pluginId,
      //   attribute_name: AttributeNameEnum.STATE,
      //   value: null as any
      // });

      yield self.setTileRequest.send(api.spaceAttributeRepository.deleteSpaceAttribute, {
        spaceId: objectId,
        plugin_id: PluginIdEnum.IMAGE,
        attribute_name: AttributeNameEnum.STATE
      });
    })
  }))
  .views((self) => ({
    get imageSrc(): string | null {
      return getImageAbsoluteUrl(self.content?.render_hash, ImageSizeEnum.S5);
    },
    get title(): string | null {
      return self.content?.title || null;
    }
  }));

export {AssetStore};
