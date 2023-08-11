import {cast, flow, types} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum-xyz/core';
import {AttributeNameEnum} from '@momentum-xyz/sdk';

import {api, UploadFileResponse} from 'api';
import {FieldErrorInterface} from 'api/interfaces';
import {WorldFormInterface} from 'core/interfaces';
import {PluginIdEnum} from 'api/enums';

const WorldEditorStore = types.compose(
  ResetModel,
  types
    .model('WorldEditorStore', {
      fieldErrors: types.optional(types.array(types.frozen<FieldErrorInterface>()), []),
      editRequest: types.optional(RequestModel, {}),
      uploadImageRequest: types.optional(RequestModel, {})
    })
    .actions((self) => ({
      editWorld: flow(function* (id: string, form: WorldFormInterface, prevHash?: string) {
        self.fieldErrors = cast([]);

        let avatarHash = prevHash;

        // 1. Avatar uploading.
        if (form.avatarFile) {
          const imageResponse: UploadFileResponse = yield self.uploadImageRequest.send(
            api.mediaRepository.uploadImage,
            {file: form.avatarFile}
          );

          if (imageResponse?.hash) {
            avatarHash = imageResponse?.hash;
          }
        }

        yield self.editRequest.send(api.spaceAttributeRepository.setSpaceAttribute, {
          spaceId: id,
          plugin_id: PluginIdEnum.CORE,
          attribute_name: AttributeNameEnum.WORLD_AVATAR,
          value: {render_hash: avatarHash || ''}
        });

        yield self.editRequest.send(api.spaceAttributeRepository.setSpaceAttribute, {
          spaceId: id,
          plugin_id: PluginIdEnum.CORE,
          attribute_name: AttributeNameEnum.NAME,
          value: {name: form.name}
        });

        yield self.editRequest.send(api.spaceAttributeRepository.setSpaceAttribute, {
          spaceId: id,
          plugin_id: PluginIdEnum.CORE,
          attribute_name: AttributeNameEnum.DESCRIPTION,
          value: {description: form.description}
        });

        yield self.editRequest.send(api.spaceAttributeRepository.setSpaceAttribute, {
          spaceId: id,
          plugin_id: PluginIdEnum.CORE,
          attribute_name: AttributeNameEnum.WEBSITE_LINK,
          value: {website_link: form.website_link}
        });

        /*if (self.editRequest.isError && response?.errors) {
          self.fieldErrors = cast(
            Object.keys(response.errors).map((key) => ({
              fieldName: key,
              errorMessage: response.errors[key]
            }))
          );
        }*/

        return {isDone: self.editRequest.isDone};
      })
    }))
    .views((self) => ({
      get isUpdating(): boolean {
        return self.editRequest.isPending || self.uploadImageRequest.isPending;
      },
      get formErrors(): FieldErrorInterface[] {
        return [...self.fieldErrors];
      }
    }))
);

export {WorldEditorStore};
