import {cast, flow, types} from 'mobx-state-tree';
import {t} from 'i18next';
import {RequestModel, ResetModel, Dialog, SpaceTypeEnum} from '@momentum-xyz/core';

import {UserProfileModel, UserSpaceDetails} from 'core/models';
import {
  api,
  UserProfileInterface,
  NewSpaceDetailsInterface,
  UserOwnedSpacesResponse,
  UserSpaceListItemResponse,
  UploadAvatarResponse
} from 'api';
import {FieldErrorInterface} from 'api/interfaces';

const UserProfileStore = types.compose(
  ResetModel,
  types
    .model('UserProfileStore', {
      userProfile: types.maybe(UserProfileModel),
      canCreateInitiative: types.maybe(types.boolean),
      userSpaceList: types.optional(types.array(UserSpaceDetails), []),
      profileFetchRequest: types.optional(RequestModel, {}),
      createTableRequest: types.optional(RequestModel, {}),
      avatarRequest: types.optional(RequestModel, {}),
      inviteToTableRequest: types.optional(RequestModel, {}),
      editProfileRequest: types.optional(RequestModel, {}),
      userOwnedSpacesRequest: types.optional(RequestModel, {}),
      editAvatarDialog: types.optional(Dialog, {}),
      userInitiativesRequest: types.optional(RequestModel, {}),
      fieldErrors: types.optional(types.array(types.frozen<FieldErrorInterface>()), []),
      isEditingProfile: false,
      isSavingProfile: false
    })
    .volatile<{selectedImage: File | undefined}>(() => ({
      selectedImage: undefined
    }))
    .actions((self) => ({
      fetchProfile: flow(function* (userId: string) {
        self.userProfile = cast(
          yield self.profileFetchRequest.send(api.userRepository.fetchProfile, {
            userId
          })
        );

        return self.profileFetchRequest.isDone;
      }),
      fetchUserSpaceList: flow(function* (userId: string) {
        const response: UserSpaceListItemResponse[] = yield self.userInitiativesRequest.send(
          api.spaceRepository.fetchUserSpaceList,
          {userId}
        );

        if (response) {
          self.userSpaceList = cast(response);
        }

        return self.userInitiativesRequest.isDone;
      }),
      grabATable: flow(function* (worldId: string, userId: string) {
        const space: NewSpaceDetailsInterface = {
          name: t('labels.grabTable'),
          description: t('labels.grabTable'),
          spaceType: SpaceTypeEnum.GRAB_A_TABLE,
          visibility: true,
          root: false,
          worldId
        };

        const response = yield self.createTableRequest.send(api.spaceRepository.create, {space});
        if (response?.id) {
          const inviteData = {isTable: true, spaceId: response.id, userId};
          yield self.inviteToTableRequest.send(
            api.spaceInviteRepository.inviteToSpaceOrTable,
            inviteData
          );

          return response?.id;
        }
      }),
      fetchUserOwnedSpaces: flow(function* (worldId: string) {
        const response: UserOwnedSpacesResponse = yield self.userOwnedSpacesRequest.send(
          api.spaceRepository.fetchUserOwnedSpaces,
          {
            worldId
          }
        );

        self.canCreateInitiative = response.canCreate;
        return response;
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
        const response = yield self.editProfileRequest.send(api.profileRepository.update, {
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

export {UserProfileStore};
