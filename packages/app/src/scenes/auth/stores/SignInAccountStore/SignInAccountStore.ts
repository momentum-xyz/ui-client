import {cast, flow, types} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum-xyz/core';

import {api, UploadImageResponse} from 'api';
import {FieldErrorInterface} from 'api/interfaces';
import {SignUpFormInterface} from 'core/interfaces';

const SignInAccountStore = types.compose(
  ResetModel,
  types
    .model('SignInAccountStore', {
      request: types.optional(RequestModel, {}),
      avatarRequest: types.optional(RequestModel, {}),
      fieldErrors: types.optional(types.array(types.frozen<FieldErrorInterface>()), [])
    })
    .actions((self) => ({
      getAvatarHash: flow(function* (form: SignUpFormInterface) {
        if (!form.avatar) {
          return;
        }

        const data = {file: form.avatar};
        const userResponse: UploadImageResponse = yield self.avatarRequest.send(
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
          const userResponse: UploadImageResponse = yield self.avatarRequest.send(
            api.mediaRepository.uploadImage,
            data
          );

          avatarHash = userResponse?.hash;
        }

        // 2. Profile updating.
        const response = yield self.request.send(api.userProfileRepository.update, {
          name: form.name || '',
          profile: {
            avatarHash
          }
        });

        if (self.request.isError && response?.errors) {
          self.fieldErrors = cast(
            // eslint-disable-next-line
            Object.keys(response.errors).map((key) => ({
              fieldName: key,
              errorMessage: response.errors[key]
            }))
          );
        }

        return self.request.isDone;
      })
    }))
    .views((self) => ({
      get isUpdating(): boolean {
        return self.request.isPending || self.avatarRequest.isPending;
      },
      get errors(): FieldErrorInterface[] {
        return [...self.fieldErrors];
      }
    }))
);

export {SignInAccountStore};
