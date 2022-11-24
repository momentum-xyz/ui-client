import {flow, types} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum-xyz/core';

import {AssetTypeEnum} from 'core/enums';
import {
  api,
  Asset2DResponse,
  GetObjectResponse,
  ObjectInterface,
  ObjectMetadataInterface,
  ObjectOptionsInterface
} from 'api';
import {appVariables} from 'api/constants';

const TileStore = types
  .compose(
    ResetModel,
    types.model('VideoStore', {
      assetType: types.maybe(types.string),
      request: types.optional(RequestModel, {}),
      content: types.maybe(types.frozen<ObjectInterface>())
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
      object: Asset2DResponse<ObjectMetadataInterface, ObjectOptionsInterface> | undefined,
      spaceId: string
    ) {
      if (!object) {
        return;
      }
      const {meta} = object;

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
      return `${appVariables.RENDER_SERVICE_URL}/get/${self.content?.render_hash}`;
    }
  }));

export {TileStore};
