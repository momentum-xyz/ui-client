import {cast, flow, types} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum-xyz/core';

import {api, UploadAvatarResponse} from 'api';
import {FieldErrorInterface} from 'api/interfaces';
import {SignUpFormInterface} from 'core/interfaces';

const SignUpCompleteStore = types.compose(
  ResetModel,
  types
    .model('SignUpCompleteStore', {
      request: types.optional(RequestModel, {}),
      avatarRequest: types.optional(RequestModel, {}),
      fieldErrors: types.optional(types.array(types.frozen<FieldErrorInterface>()), [])
    })
    .actions((self) => ({
      updateProfile: flow(function* (form: SignUpFormInterface) {
        // 1. Avatar uploading.
        let avatarHash;
        if (form.avatar) {
          const data = {avatar: form.avatar};
          const userResponse: UploadAvatarResponse = yield self.avatarRequest.send(
            api.profileRepository.uploadAvatar,
            data
          );
          avatarHash = userResponse?.hash;
        }

        // 2. Profile updating.
        const response = yield self.request.send(api.userProfileRepository.update, {
          name: form.name || '',
          profile: {
            bio: form.bio,
            profileLink: form.profileLink,
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

        return {success: true, onBoarded: response?.profile?.onBoarded || false};
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

export {SignUpCompleteStore};
