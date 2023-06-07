import {cast, flow, types} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum-xyz/core';

import {api, UploadFileResponse} from 'api';
import {FieldErrorInterface} from 'api/interfaces';
import {SignUpFormInterface} from 'core/interfaces';

const LoginStore = types.compose(
  ResetModel,
  types
    .model('LoginStore', {
      avatarRequest: types.optional(RequestModel, {}),
      profileRequest: types.optional(RequestModel, {}),
      fieldErrors: types.optional(types.array(types.frozen<FieldErrorInterface>()), [])
    })
    .actions((self) => ({
      getAvatarHash: flow(function* (form: SignUpFormInterface) {
        if (!form.avatar) {
          return;
        }

        const data = {file: form.avatar};
        const userResponse: UploadFileResponse = yield self.avatarRequest.send(
          api.mediaRepository.uploadImage,
          data
        );

        return userResponse?.hash;
      }),
      updateProfile: flow(function* (form: SignUpFormInterface) {
        // 1. Avatar uploading.
        let avatarHash;
        if (form.avatar) {
          const data = {file: form.avatar};
          const userResponse: UploadFileResponse = yield self.avatarRequest.send(
            api.mediaRepository.uploadImage,
            data
          );

          avatarHash = userResponse?.hash;
        }

        // 2. Profile updating.
        const response = yield self.profileRequest.send(api.userProfileRepository.update, {
          name: form.name || '',
          profile: {
            avatarHash
          }
        });

        if (self.profileRequest.isError && response?.errors) {
          self.fieldErrors = cast(
            Object.keys(response.errors).map((key) => ({
              fieldName: key,
              errorMessage: response.errors[key]
            }))
          );
        }

        return self.profileRequest.isDone;
      })
    }))
    .views((self) => ({
      get isUpdating(): boolean {
        return self.profileRequest.isPending || self.avatarRequest.isPending;
      }
    }))
);

export {LoginStore};
