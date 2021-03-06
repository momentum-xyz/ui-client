import {cast, flow, types} from 'mobx-state-tree';

import {SpaceType} from 'core/enums';
import {bytesToUuid} from 'core/utils';
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
  CreateSpaceResponse,
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
      userTableId: types.maybe(types.string),
      userSpaceList: types.optional(types.array(UserSpaceDetails), []),
      profileFetchRequest: types.optional(RequestModel, {}),
      findTablesRequest: types.optional(RequestModel, {}),
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
      fetchUserTable: flow(function* () {
        if (!self.userProfile) {
          return;
        }

        self.userTableId = yield self.findTablesRequest.send(api.tablesRepository.findTable, {
          userId: self.userProfile.uuid
        });
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
        const newSpace: NewSpaceDetails = {
          worldId: worldId,
          description: 'Grab a Table',
          root: false,
          visibility: true,
          name: 'Grab a Table',
          spaceType: SpaceType.GRAB_A_TABLE
        };

        let tableId = '';
        if (!self.userTableId) {
          const postRs: CreateSpaceResponse = yield self.createTableRequest.send(
            api.spaceRepository.create,
            {
              newSpace
            }
          );
          tableId = postRs.id;
        } else {
          tableId = self.userTableId;
        }

        yield self.inviteToTableRequest.send(api.spaceInviteRepository.inviteToSpaceOrTable, {
          isTable: true,
          spaceId: tableId,
          userId
        });

        const {data: response} = yield api.spaceRepository.fetchSpace({spaceId: tableId});
        const typeUuid = bytesToUuid(response.space.uiTypeId.data as Buffer);
        return {tableId, typeUuid};
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
