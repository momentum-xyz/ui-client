import {cast, flow, types} from 'mobx-state-tree';
import {RequestModel, ResetModel, Dialog} from '@momentum-xyz/core';

import {User} from 'core/models';
import {api, UserProfileInterface, UploadImageResponse} from 'api';
import {FieldErrorInterface} from 'api/interfaces';

const ProfileStore = types.compose(
  ResetModel,
  types
    .model('ProfileStore', {
      profileDialog: types.optional(Dialog, {}),
      userProfile: types.maybe(User),
      fieldErrors: types.optional(types.array(types.frozen<FieldErrorInterface>()), []),
      fetchRequest: types.optional(RequestModel, {}),
      editAvatarRequest: types.optional(RequestModel, {}),
      editRequest: types.optional(RequestModel, {})
    })
    .actions((self) => ({
      fetchProfile: flow(function* () {
        const response = yield self.fetchRequest.send(api.userRepository.fetchMe, {});
        if (response) {
          self.userProfile = cast(response);
        }
      }),
      editProfile: flow(function* (name: string, profile: UserProfileInterface) {
        // 1. Profile updating.
        const response = yield self.editRequest.send(api.userProfileRepository.update, {
          name,
          profile: {
            bio: profile.bio,
            profileLink: profile.profileLink,
            location: profile.location,
            avatarHash: self.userProfile?.profile.avatarHash
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
      }),
      editImage: flow(function* (file: File) {
        if (!self.userProfile?.profile) {
          return;
        }

        // 1. Avatar uploading.
        const data = {file: file};
        const userResponse: UploadImageResponse = yield self.editAvatarRequest.send(
          api.mediaRepository.uploadImage,
          data
        );
        const avatarHash = userResponse?.hash;

        // 2. Profile updating.
        const response = yield self.editRequest.send(api.userProfileRepository.update, {
          name: self.userProfile.name,
          profile: {
            ...self.userProfile.profile,
            avatarHash: avatarHash
          }
        });

        self.userProfile.profile.avatarHash = response?.profile?.avatarHash;
      })
    }))
    .views((self) => ({
      get isLoading(): boolean {
        return self.fetchRequest.isPending;
      },
      get formErrors(): FieldErrorInterface[] {
        return [...self.fieldErrors];
      }
    }))
);

export {ProfileStore};
