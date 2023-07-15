import {flow, types} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum-xyz/core';
import {ImageSizeEnum} from '@momentum-xyz/ui-kit';
import {AttributeNameEnum} from '@momentum-xyz/sdk';

import {PluginIdEnum} from 'api/enums';
import {getImageAbsoluteUrl} from 'core/utils';
import {api, GetObjectResponse, ObjectInterface, UploadFileResponse} from 'api';

const NormalContent = types
  .compose(
    ResetModel,
    types.model('NormalContent', {
      content: types.maybe(types.frozen<ObjectInterface>()),

      request: types.optional(RequestModel, {}),
      imageUploadRequest: types.optional(RequestModel, {}),
      updateContentRequest: types.optional(RequestModel, {}),
      deleteContentRequest: types.optional(RequestModel, {})
    })
  )
  .actions((self) => ({
    initContent: flow(function* (pluginId: string, spaceId: string) {
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
    postNewImage: flow(function* (objectId: string, file: File, title?: string) {
      const userResponse: UploadFileResponse = yield self.imageUploadRequest.send(
        api.mediaRepository.uploadImage,
        {file}
      );
      const imageHash = userResponse?.hash;

      yield self.updateContentRequest.send(api.spaceAttributeRepository.setSpaceAttribute, {
        spaceId: objectId,
        plugin_id: PluginIdEnum.IMAGE,
        attribute_name: AttributeNameEnum.STATE,
        value: {render_hash: imageHash, title}
      });

      yield self.initContent(PluginIdEnum.IMAGE, objectId);
    }),
    postNewContent: flow(function* (objectId: string, content: ObjectInterface) {
      yield self.updateContentRequest.send(api.spaceAttributeRepository.setSpaceAttribute, {
        spaceId: objectId,
        plugin_id: PluginIdEnum.TEXT,
        attribute_name: AttributeNameEnum.STATE,
        value: content
      });

      yield self.initContent(PluginIdEnum.TEXT, objectId);
    }),
    deleteContent: flow(function* (pluginId: string, objectId: string) {
      yield self.deleteContentRequest.send(api.spaceAttributeRepository.deleteSpaceAttribute, {
        spaceId: objectId,
        plugin_id: pluginId,
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

export {NormalContent};
