import {cast, flow, types} from 'mobx-state-tree';
import {RequestModel, ResetModel, Dialog} from '@momentum-xyz/core';

import {api, UploadImageResponse} from 'api';
import {FieldErrorInterface} from 'api/interfaces';
import {ProfileFormInterface} from 'core/interfaces';

const ProfileStore = types.compose(
  ResetModel,
  types
    .model('ProfileStore', {
      dialog: types.optional(Dialog, {}),
      fieldErrors: types.optional(types.array(types.frozen<FieldErrorInterface>()), []),
      editRequest: types.optional(RequestModel, {}),
      editAvatarRequest: types.optional(RequestModel, {})
    })
    .actions((self) => ({
      editProfile: flow(function* (form: ProfileFormInterface, previousImageHash?: string) {
        let avatarHash = previousImageHash;

        // 1. Avatar uploading.
        if (form.avatarFile) {
          const userResponse: UploadImageResponse = yield self.editAvatarRequest.send(
            api.mediaRepository.uploadImage,
            {file: form.avatarFile}
          );

          if (userResponse?.hash) {
            avatarHash = userResponse?.hash;
          }
        }

        // 2. Profile updating.
        const response = yield self.editRequest.send(api.userProfileRepository.update, {
          name: form.name,
          profile: {
            bio: form.bio,
            profileLink: form.profileLink,
            location: form.location,
            avatarHash
          }
        });

        if (self.editRequest.isError && response?.errors) {
          self.fieldErrors = cast(
            Object.keys(response.errors).map((key) => ({
              fieldName: key,
              errorMessage: response.errors[key]
            }))
          );
          return false;
        }

        return true;
      })
    }))
    .views((self) => ({
      get isUpdating(): boolean {
        return self.editRequest.isPending || self.editAvatarRequest.isPending;
      },
      get formErrors(): FieldErrorInterface[] {
        return [...self.fieldErrors];
      }
    }))
);

export {ProfileStore};
