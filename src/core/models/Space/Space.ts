import {Instance, types, flow, cast} from 'mobx-state-tree';

import {UUIDModel} from 'core/models/UUID';
import {SpaceAncestorModel} from 'core/models/SpaceAncestor';
import {bytesToUuid} from 'core/utils';
import {SpaceUserModel} from 'core/models/SpaceUser';
import {SubSpaceModel} from 'core/models/SubSpace';
import {RequestModel} from 'core/models/Request';
import {ResetModel} from 'core/models/ResetModel';
import {api, SpaceResponse} from 'api';
import {SpaceType} from 'core/enums';
import {GetAllowedSpaceTypesResponse} from 'api';

const Space = types
  .compose(
    ResetModel,
    types.model('Space', {
      // Base information
      id: types.string,
      name: types.maybe(types.string),
      description: types.maybe(types.string),
      users: types.optional(types.array(SpaceUserModel), []),
      didFetchSpaceInformation: false,
      secret: types.maybe(types.number),
      type: types.maybe(types.string),
      parentId: types.maybe(UUIDModel),

      // User - space information
      isAdmin: false,
      isMember: false,
      isOwner: false,
      isTable: false,

      // Requests
      fetchSpaceInformationRequest: types.optional(RequestModel, {}),
      addUserRequest: types.optional(RequestModel, {}),
      inviteUserRequest: types.optional(RequestModel, {}),
      removeUserRequest: types.optional(RequestModel, {}),
      editUserRequest: types.optional(RequestModel, {}),
      addSubSpaceRequest: types.optional(RequestModel, {}),
      allowedSpaceTypesRequest: types.optional(RequestModel, {}),

      // Admin
      adminAncestors: types.optional(types.array(SpaceAncestorModel), []),
      subSpaces: types.optional(types.array(SubSpaceModel), []),
      isStakeShown: false,
      allowedSpaceTypes: types.optional(types.array(types.string), []),

      // Other
      kusamaOperatorId: types.maybe(types.string)
    })
  )
  .actions((self) => ({
    canUserJoin: flow(function* (spaceId: string) {
      const response = yield self.fetchSpaceInformationRequest.send(
        api.spaceRepository.fetchSpace,
        {spaceId}
      );
      return response && !(response.space.secret === 1 && !(response.admin || response.member));
    }),
    fetchSpaceInformation: flow(function* () {
      if (!self.id) {
        return;
      }

      const response: SpaceResponse = yield self.fetchSpaceInformationRequest.send(
        api.spaceRepository.fetchSpace,
        {
          spaceId: self.id
        }
      );

      // FIXME: Assign once
      if (response) {
        self.name = response.space.name;
        self.isTable = response.spaceType === SpaceType.GRAB_A_TABLE;
        self.isAdmin = response.admin;
        self.isMember = response.member ?? false;
        self.isOwner = response.owner ?? false;
        self.isStakeShown = !!response.space.metadata?.kusama_metadata?.operator_id;
        self.secret = response.space.secret;
        self.type = response.spaceType;
        self.parentId = response.space.parentId;
        self.description = response.space.description;
        self.kusamaOperatorId = response.space.metadata?.kusama_metadata?.operator_id;
        self.adminAncestors = cast(
          response.ancestors
            ?.filter((ancestor) => ancestor.isAdmin === '1')
            .map((ancestor) => ({
              id: bytesToUuid(ancestor.id.data),
              name: ancestor.name,
              isSelected: bytesToUuid(ancestor.id.data) === self.id
            }))
        );

        self.users = cast(
          response.space.userSpaces?.map((userSpace) => ({
            id: userSpace.user.id,
            name: userSpace.user.name,
            isAdmin: !!userSpace.isAdmin
          }))
        );

        self.subSpaces = cast(
          response.children.map((subSpace) => ({
            id: bytesToUuid(subSpace.id.data),
            name: subSpace.name,
            hasSubspaces: (subSpace.children?.length ?? 0) > 0
          }))
        );

        self.didFetchSpaceInformation = true;
      }
    }),
    addUser: flow(function* (userId: string, isAdmin: boolean) {
      if (!self.id) {
        return;
      }

      yield self.addUserRequest.send(api.spaceRepository.addUser, {
        user: {
          userId,
          spaceId: self.id,
          isAdmin
        }
      });
    }),
    inviteUser: flow(function* (email: string, isAdmin: boolean) {
      if (!self.id) {
        return;
      }

      yield self.inviteUserRequest.send(api.userRepository.inviteToSpace, {
        invitedUser: {
          email,
          spaceId: self.id,
          isAdmin
        }
      });
    }),
    removeUser: flow(function* (userId: string) {
      if (!self.id) {
        return;
      }

      yield self.removeUserRequest.send(api.spaceRepository.removeUser, {
        user: {
          userId,
          spaceId: self.id
        }
      });
    }),
    editUser: flow(function* (userId: string, isAdmin: boolean) {
      if (!self.id) {
        return;
      }

      yield self.editUserRequest.send(api.spaceRepository.editUser, {
        user: {
          userId,
          spaceId: self.id,
          isAdmin
        }
      });
    }),
    addSubSpace: flow(function* (parentId: string, name: string, type: string) {
      const newSpace = {
        parentId: parentId,
        name: name,
        spaceType: type as SpaceType
      };

      yield self.addSubSpaceRequest.send(api.spaceRepository.create, {
        newSpace
      });
    }),
    fetchAllowedSubSpaceTypes: flow(function* () {
      if (!self.id) {
        return;
      }

      const response: GetAllowedSpaceTypesResponse = yield self.allowedSpaceTypesRequest.send(
        api.spaceTypeRepository.fetchAllowedSpaceTypes,
        {
          spaceId: self.id
        }
      );

      if (response) {
        self.allowedSpaceTypes = cast(response);
      }
    })
  }))
  .views((self) => ({
    get parentUUID() {
      return self.parentId ? bytesToUuid(self.parentId.data) : undefined;
    },
    get isPrivate() {
      return self.secret === 1;
    }
  }));

export interface SpaceInterface extends Instance<typeof Space> {}

export {Space};
