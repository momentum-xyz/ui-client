import {flow, types} from 'mobx-state-tree';
import {Dialog, RequestModel, ResetModel} from '@momentum-xyz/core';
import {ImageSizeEnum} from '@momentum-xyz/ui-kit';
import {AttributeNameEnum} from '@momentum-xyz/sdk';

import {appVariables} from 'api/constants';
import {AssetTypeEnum} from 'core/enums';
import {
  api,
  Asset2dResponse,
  GetObjectResponse,
  ObjectInterface,
  ObjectMetadataInterface,
  ObjectOptionsInterface,
  UploadImageResponse
} from 'api';

const TileStore = types
  .compose(
    ResetModel,
    types.model('VideoStore', {
      assetType: types.maybe(types.string),
      content: types.maybe(types.frozen<ObjectInterface>()),
      pluginId: types.maybe(types.string),

      changeTileDialog: types.optional(Dialog, {}),

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
  }))
  .actions((self) => ({
    setObject(
      object: Asset2dResponse<ObjectMetadataInterface, ObjectOptionsInterface> | undefined,
      spaceId: string,
      pluginId: string
    ) {
      if (!object) {
        return;
      }
      const {meta} = object;
      self.pluginId = pluginId;

      switch (meta.name) {
        case AssetTypeEnum.TEXT:
          self.assetType = AssetTypeEnum.TEXT;
          self.getSpaceAttributeValue(meta.pluginId, spaceId);
          break;
        case AssetTypeEnum.IMAGE:
          self.assetType = AssetTypeEnum.IMAGE;
          self.getSpaceAttributeValue(meta.pluginId, spaceId);
          break;
        case AssetTypeEnum.VIDEO:
          self.assetType = AssetTypeEnum.VIDEO;
          self.getSpaceAttributeValue(meta.pluginId, spaceId);
          break;
        default:
          break;
      }
    },
    postNewImage: flow(function* (objectId: string, file: File) {
      if (!self.pluginId) {
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
        plugin_id: self.pluginId,
        attribute_name: AttributeNameEnum.STATE,
        value: {render_hash: imageHash}
      });

      yield self.getSpaceAttributeValue(self.pluginId, objectId);
    }),
    postNewContent: flow(function* (objectId: string, content: ObjectInterface) {
      if (!self.pluginId) {
        return;
      }

      yield self.setTileRequest.send(api.spaceAttributeRepository.setSpaceAttribute, {
        spaceId: objectId,
        plugin_id: self.pluginId,
        attribute_name: AttributeNameEnum.STATE,
        value: content
      });

      yield self.getSpaceAttributeValue(self.pluginId, objectId);
    })
  }))
  .views((self) => ({
    get imageSrc(): string | null {
      if (!self.content?.render_hash) {
        return null;
      }
      return `${appVariables.RENDER_SERVICE_URL}/texture/${ImageSizeEnum.S5}/${self.content?.render_hash}`;
    }
  }));

export {TileStore};
