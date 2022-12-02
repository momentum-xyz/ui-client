import {cast, flow, types} from 'mobx-state-tree';
import {RequestModel, ResetModel, Dialog} from '@momentum-xyz/core';

import {User, UserSpaceDetails} from 'core/models';
import {api, UserProfileInterface, UploadAvatarResponse} from 'api';
import {FieldErrorInterface} from 'api/interfaces';

const ProfileStore = types.compose(
  ResetModel,
  types
    .model('ProfileStore', {
      profileDialog: types.optional(Dialog, {}),

      userProfile: types.maybe(User),
      canCreateInitiative: types.maybe(types.boolean),
      userSpaceList: types.optional(types.array(UserSpaceDetails), []),
      profileFetchRequest: types.optional(RequestModel, {}),

      avatarRequest: types.optional(RequestModel, {}),
      inviteToTableRequest: types.optional(RequestModel, {}),
      editProfileRequest: types.optional(RequestModel, {}),

      editAvatarDialog: types.optional(Dialog, {}),
      fieldErrors: types.optional(types.array(types.frozen<FieldErrorInterface>()), []),
      isEditingProfile: false,
      isSavingProfile: false
    })
    .volatile<{selectedImage: File | undefined}>(() => ({
      selectedImage: undefined
    }))
    .actions((self) => ({
      fetchProfile: flow(function* () {
        const response = yield self.profileFetchRequest.send(api.userRepository.fetchMe, {});
        if (response) {
          self.userProfile = cast(response);
        }
      }),
      editProfile: flow(function* (name: string, profile: UserProfileInterface) {
        self.isSavingProfile = true;
        // 1. Avatar uploading.
        let avatarHash;
        if (profile.image) {
          const data = {avatar: profile.image};
          const userResponse: UploadAvatarResponse = yield self.avatarRequest.send(
            api.profileRepository.uploadAvatar,
            data
          );
          avatarHash = userResponse?.hash;
        }

        // 2. Profile updating.
        const response = yield self.editProfileRequest.send(api.userProfileRepository.update, {
          name,
          profile: {
            bio: profile.bio,
            profileLink: profile.profileLink,
            location: profile.location,
            avatarHash: profile.image ? avatarHash : profile.avatarHash
          }
        });
        self.isSavingProfile = false;
        if (self.editProfileRequest.isError && response?.errors) {
          self.fieldErrors = cast(
            Object.keys(response.errors).map((key) => ({
              fieldName: key,
              errorMessage: response.errors[key]
            }))
          );

          return self.editProfileRequest.isDone;
        }
        self.selectedImage = undefined;
        self.isEditingProfile = false;
        return self.editProfileRequest.isDone;
      }),
      setImage(image?: File) {
        self.selectedImage = image;
      },
      openEdit() {
        self.isEditingProfile = true;
      }
    }))
    .views((self) => ({
      get formErrors(): FieldErrorInterface[] {
        return [...self.fieldErrors];
      }
    }))
);

export {ProfileStore};
