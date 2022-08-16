import {cast, flow, types} from 'mobx-state-tree';
import {t} from 'i18next';

import {SpaceType} from 'core/enums';
import {
  DialogModel,
  RequestModel,
  ResetModel,
  UserProfileModel,
  UserSpaceDetails
} from 'core/models';
import {
  api,
  UserProfileInterface,
  NewSpaceDetails,
  UserOwnedSpacesResponse,
  UserSpaceListItemResponse
} from 'api';

const ProfileStore = types.compose(
  ResetModel,
  types
    .model('ProfileStore', {
      userProfile: types.maybe(UserProfileModel),
      canCreateInitiative: types.maybe(types.boolean),
      userSpaceList: types.optional(types.array(UserSpaceDetails), []),
      profileFetchRequest: types.optional(RequestModel, {}),
      createTableRequest: types.optional(RequestModel, {}),
      inviteToTableRequest: types.optional(RequestModel, {}),
      editProfileRequest: types.optional(RequestModel, {}),
      userOwnedSpacesRequest: types.optional(RequestModel, {}),
      editAvatarDialog: types.optional(DialogModel, {}),
      userInitiativesRequest: types.optional(RequestModel, {})
    })
    .actions((self) => ({
      fetchProfile: flow(function* (userId: string) {
        self.userProfile = cast(
          yield self.profileFetchRequest.send(api.userRepository.fetchProfile, {
            userId
          })
        );
      }),
      fetchUserSpaceList: flow(function* (userId: string) {
        const response: UserSpaceListItemResponse[] = yield self.userInitiativesRequest.send(
          api.spaceRepository.fetchUserSpaceList,
          {userId}
        );

        if (response) {
          self.userSpaceList = cast(response);
        }
      }),
      grabATable: flow(function* (worldId: string, userId: string) {
        const space: NewSpaceDetails = {
          name: t('labels.grabTable'),
          description: t('labels.grabTable'),
          spaceType: SpaceType.GRAB_A_TABLE,
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
        yield self.editProfileRequest.send(api.profileRepository.update, {
          name,
          profile
        });

        return self.editProfileRequest.isDone;
      })
    }))
);

export {ProfileStore};
