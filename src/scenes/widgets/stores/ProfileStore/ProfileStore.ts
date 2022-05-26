import {cast, flow, types} from 'mobx-state-tree';

import {DialogModel, RequestModel, ResetModel, UserProfileModel, SpaceModel} from 'core/models';
import {api, FetchUserInitiativesResponse, UserProfileInterface} from 'api';
import {
  CreateSpaceResponse,
  NewSpaceDetails,
  UserOwnedSpacesResponse
} from 'api/repositories/spaceRepository/spaceRepository.api.types';
import {SpaceType} from 'core/enums';
import WebsocketService from 'context/Websocket/WebsocketService';
import {bytesToUuid} from 'core/utils';

const ProfileStore = types.compose(
  ResetModel,
  types
    .model('ProfileStore', {
      userProfile: types.maybe(UserProfileModel),
      canCreateInitiative: types.maybe(types.boolean),
      userTableId: types.maybe(types.string),
      userInitiatives: types.optional(types.array(SpaceModel), []),
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
      fetchUserInitiatives: flow(function* () {
        const response: FetchUserInitiativesResponse = yield self.userInitiativesRequest.send(
          api.userRepository.fetchUserInitiatives,
          {userId: self.userProfile?.uuid}
        );

        if (response !== undefined) {
          self.userInitiatives = cast(response);
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
      sendHighFive: flow(function* () {
        if (!self.userProfile) {
          return;
        }

        yield WebsocketService.sendHighFive(self.userProfile.uuid);
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
