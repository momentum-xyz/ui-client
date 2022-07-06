import {types, flow, cast, Instance} from 'mobx-state-tree';

import {RequestModel, ResetModel, SpaceModel} from 'core/models';
import {api} from 'api';
import {bytesToUuid} from 'core/utils';
import {SpaceResponse} from 'api/repositories/spaceRepository/spaceRepository.api.types';
import {GetAllowedSpaceTypesResponse} from 'api/repositories/spaceTypeRepository/spaceTypeRepository.api.types';
import {SpaceType} from 'core/enums';

const SpaceStore = types.compose(
  ResetModel,
  types
    .model('SpaceStore', {
      request: types.optional(RequestModel, {}),
      addUserRequest: types.optional(RequestModel, {}),
      inviteUserRequest: types.optional(RequestModel, {}),
      removeUserRequest: types.optional(RequestModel, {}),
      editUserRequest: types.optional(RequestModel, {}),
      addSubSpaceRequest: types.optional(RequestModel, {}),
      allowedSpaceTypesRequest: types.optional(RequestModel, {}),
      isAdmin: false,
      isMember: false,
      isOwner: false,
      space: types.optional(SpaceModel, {}),
      allowedSpaceTypes: types.optional(types.array(types.string), []),
      didFetchSpaceInformation: false
    })
    .actions((self) => ({
      setSpace(spaceId: string) {
        self.didFetchSpaceInformation = false;
        self.space.id = spaceId;
      },
      canUserJoin: flow(function* (spaceId: string) {
        const response = yield self.request.send(api.spaceRepository.fetchSpace, {spaceId});
        return response && !(response.space.secret === 1 && !(response.admin || response.member));
      }),
      fetchSpaceInformation: flow(function* () {
        if (!self.space.id) {
          return;
        }

        const response: SpaceResponse = yield self.request.send(api.spaceRepository.fetchSpace, {
          spaceId: self.space.id
        });

        if (response) {
          self.space.name = response.space.name;

          // Here you can add any info about space needed
          self.isAdmin = response.admin;
          self.isMember = response.member ?? false;
          self.isOwner = response.owner ?? false;
          self.space.secret = response.space.secret;
          self.space.type = response.spaceType;
          self.space.parentId = response.space.parentId;
          self.space.description = response.space.description;
          self.space.kusamaOperatorId = response.space.metadata?.kusama_metadata?.operator_id;
          self.space.adminAncestors = cast(
            response.ancestors
              ?.filter((ancestor) => ancestor.isAdmin === '1')
              .map((ancestor) => ({
                id: bytesToUuid(ancestor.id.data),
                name: ancestor.name,
                isSelected: bytesToUuid(ancestor.id.data) === self.space.id
              }))
          );

          self.space.users = cast(
            response.space.userSpaces?.map((userSpace) => ({
              id: userSpace.user.id,
              name: userSpace.user.name,
              isAdmin: !!userSpace.isAdmin
            }))
          );

          self.space.subSpaces = cast(
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
        if (!self.space.id) {
          return;
        }

        yield self.addUserRequest.send(api.spaceRepository.addUser, {
          user: {
            userId,
            spaceId: self.space.id,
            isAdmin
          }
        });
      }),
      inviteUser: flow(function* (email: string, isAdmin: boolean) {
        if (!self.space.id) {
          return;
        }

        yield self.inviteUserRequest.send(api.userRepository.inviteToSpace, {
          invitedUser: {
            email,
            spaceId: self.space.id,
            isAdmin
          }
        });
      }),
      removeUser: flow(function* (userId: string) {
        if (!self.space.id) {
          return;
        }

        yield self.removeUserRequest.send(api.spaceRepository.removeUser, {
          user: {
            userId,
            spaceId: self.space.id
          }
        });
      }),
      editUser: flow(function* (userId: string, isAdmin: boolean) {
        if (!self.space.id) {
          return;
        }

        yield self.editUserRequest.send(api.spaceRepository.editUser, {
          user: {
            userId,
            spaceId: self.space.id,
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
        if (!self.space.id) {
          return;
        }

        const response: GetAllowedSpaceTypesResponse = yield self.allowedSpaceTypesRequest.send(
          api.spaceTypeRepository.fetchAllowedSpaceTypes,
          {
            spaceId: self.space.id
          }
        );

        if (response) {
          self.allowedSpaceTypes = cast(response);
        }
      })
    }))
);

export interface SpaceStoreInterface extends Instance<typeof SpaceStore> {}

export {SpaceStore};
