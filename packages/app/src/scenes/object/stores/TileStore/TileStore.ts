import {flow, types} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum-xyz/core';

import {AssetTypeEnum} from 'core/enums';
import {
  api,
  Asset2dResponse,
  GetObjectResponse,
  ObjectInterface,
  ObjectMetadataInterface,
  ObjectOptionsInterface
} from 'api';

const TileStore = types
  .compose(
    ResetModel,
    types.model('VideoStore', {
      assetType: types.maybe(types.string),
      request: types.optional(RequestModel, {}),
      content: types.maybe(types.frozen<ObjectInterface>()),
      pluginId: types.maybe(types.string)
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
    }
  }))
  .views((self) => ({
    get imageSrc(): string | null {
      if (!self.content?.render_hash) {
        return null;
      }
      //TODO: Change it to render
      // return `${appVariables.RENDER_SERVICE_URL}/get/${self.content?.render_hash}`;

      return self.content.render_hash;
    }
  }));

export {TileStore};
