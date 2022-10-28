import {types, flow, cast} from 'mobx-state-tree';
import {UUIDModel} from '@momentum-xyz/core';
import {RequestModel, ResetModel, SpaceTypeEnum} from '@momentum-xyz/core';

// FIXME: Uncomment later
//import {PrivateSpaceError} from 'core/errors';
import {Space} from 'core/models';
import {SpaceAncestorModel} from 'core/models/SpaceAncestor';
import {bytesToUuid} from 'core/utils';
import {SpaceUserModel} from 'core/models/SpaceUser';
import {SubSpaceModel} from 'core/models/SubSpace';
import {api, SpaceResponse} from 'api';
import {GetAllowedSpaceTypesResponse} from 'api';

// TODO: Leave only stuff related to collaboration
// TODO: Refactor all stuff related to space administration
const SpaceStore = types
  .compose(
    ResetModel,
    types.model('SpaceStore', {
      space: types.maybeNull(Space),

      // FIXME: It is a part SpaceModel or not ???
      isTable: false,

      // TODO: Removal. It is Space model
      name: types.maybe(types.string),
      description: types.maybe(types.string),
      users: types.optional(types.array(SpaceUserModel), []),
      secret: types.maybe(types.number),
      type: types.maybe(types.string),
      parentId: types.maybe(UUIDModel),

      // TODO: Remove
      didFetchSpaceInformation: false,

      // TODO: Make SpaceRights model under core
      isModerator: false,
      isAdmin: false,
      isMember: false,
      isOwner: false,

      // Requests
      moderationRequest: types.optional(RequestModel, {}),
      fetchSpaceInformationRequest: types.optional(RequestModel, {}),
      inviteUserRequest: types.optional(RequestModel, {}),

      // TODO: Move to SpaceAdminStore Model
      addUserRequest: types.optional(RequestModel, {}),
      removeUserRequest: types.optional(RequestModel, {}),
      editUserRequest: types.optional(RequestModel, {}),
      addSubSpaceRequest: types.optional(RequestModel, {}),
      allowedSpaceTypesRequest: types.optional(RequestModel, {}),

      // TODO: Move to SpaceAdminStore Model
      adminAncestors: types.optional(types.array(SpaceAncestorModel), []),
      subSpaces: types.optional(types.array(SubSpaceModel), []),
      isStakeShown: false,
      allowedSpaceTypes: types.optional(types.array(types.string), []),

      // Other
      kusamaOperatorId: types.maybe(types.string)
    })
  )
  .actions((self) => {
    return {
      async init(spaceId: string, isTable: boolean): Promise<void> {
        // FIXME: It is a part SpaceModel
        self.isTable = isTable;

        await this.checkAccess(spaceId);
        await this.loadRights(spaceId);
        await this.loadSpace(spaceId);
      },
      checkAccess: flow(function* (spaceId: string) {
        if (!(yield self.canUserJoin(spaceId))) {
          // throw new PrivateSpaceError();
        }
      }),
      loadSpace: flow(function* (spaceId: string) {
        // TODO: Implementation
      }),
      loadRights: flow(function* (spaceId: string) {
        // TODO: Refactor. Use one request to get all rights
        self.isModerator = yield self.moderationRequest.send(
          api.spaceIntegrationsRepository.checkSpaceModeration,
          {spaceId}
        );
      })
    };
  })
  // TODO: Refactoring and movement
  .actions((self) => ({
    canUserJoin: flow(function* (spaceId: string) {
      const response = yield self.fetchSpaceInformationRequest.send(
        api.spaceRepositoryOld.fetchSpace,
        {spaceId}
      );
      return response && !(response.space.secret === 1 && !(response.admin || response.member));
    }),
    // TODO: Remove
    fetchSpaceInformation: flow(function* () {
      if (!self.id) {
        return;
      }

      const response: SpaceResponse = yield self.fetchSpaceInformationRequest.send(
        api.spaceRepositoryOld.fetchSpace,
        {
          spaceId: self.space?.id || ''
        }
      );

      // FIXME: Assign once
      if (response) {
        self.name = response.space.name;
        self.isTable = response.spaceType === SpaceTypeEnum.GRAB_A_TABLE;
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
              isSelected: bytesToUuid(ancestor.id.data) === self.space?.id
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
    // TODO: Move to SpaceAdminStore Model
    addUser: flow(function* (userId: string, isAdmin: boolean) {
      if (!self.id) {
        return;
      }

      yield self.addUserRequest.send(api.spaceRepositoryOld.addUser, {
        user: {
          userId,
          spaceId: self.space?.id || '',
          isAdmin
        }
      });
    }),
    inviteUser: flow(function* (email: string, isAdmin: boolean) {
      if (!self.id) {
        return;
      }

      yield self.inviteUserRequest.send(api.userRepository_OLD.inviteToSpace, {
        invitedUser: {
          email,
          spaceId: self.space?.id || '',
          isAdmin
        }
      });
    }),
    // TODO: Move to SpaceAdminStore Model
    removeUser: flow(function* (userId: string) {
      if (!self.id) {
        return;
      }

      yield self.removeUserRequest.send(api.spaceRepositoryOld.removeUser, {
        user: {
          userId,
          spaceId: self.space?.id || ''
        }
      });
    }),
    // TODO: Move to SpaceAdminStore Model
    editUser: flow(function* (userId: string, isAdmin: boolean) {
      if (!self.id) {
        return;
      }

      yield self.editUserRequest.send(api.spaceRepositoryOld.editUser, {
        user: {
          userId,
          spaceId: self.space?.id || '',
          isAdmin
        }
      });
    }),
    // TODO: Move to SpaceAdminStore Model
    addSubSpace: flow(function* (parentId: string, name: string, type: string) {
      const newSpace = {
        parentId: parentId,
        name: name,
        spaceType: type as SpaceTypeEnum
      };

      yield self.addSubSpaceRequest.send(api.spaceRepositoryOld.create, {
        space: newSpace
      });
    }),
    // TODO: Move to SpaceAdminStore Model
    fetchAllowedSubSpaceTypes: flow(function* () {
      if (!self.id) {
        return;
      }

      const response: GetAllowedSpaceTypesResponse = yield self.allowedSpaceTypesRequest.send(
        api.spaceTypeRepository.fetchAllowedSpaceTypes,
        {
          spaceId: self.space?.id || ''
        }
      );

      if (response) {
        self.allowedSpaceTypes = cast(response);
      }
    })
  }))
  .views((self) => ({
    get id(): string {
      return self.space?.id || '';
    },
    // TODO: Removal
    get parentUUID() {
      return self.parentId ? bytesToUuid(self.parentId.data) : undefined;
    },
    // TODO: Removal
    get isPrivate() {
      return self.secret === 1;
    },
    get isPending(): boolean {
      return self.fetchSpaceInformationRequest.isPending;
    }
  }));

export {SpaceStore};
