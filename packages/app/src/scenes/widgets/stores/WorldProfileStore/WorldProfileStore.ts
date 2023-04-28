import {cast, flow, types} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum-xyz/core';

import {api, UploadImageResponse} from 'api';
import {FieldErrorInterface} from 'api/interfaces';
import {ProfileFormInterface} from 'core/interfaces';

const WorldProfileStore = types.compose(
  ResetModel,
  types
    .model('WorldProfileStore', {
      fieldErrors: types.optional(types.array(types.frozen<FieldErrorInterface>()), []),
      editRequest: types.optional(RequestModel, {}),
      editAvatarRequest: types.optional(RequestModel, {})
    })
    .actions((self) => ({
      editWorld: flow(function* (form: ProfileFormInterface, previousImageHash?: string) {
        self.fieldErrors = cast([]);

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

        // 2. World updating
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
        }

        return {isDone: self.editRequest.isDone};
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

export {WorldProfileStore};
