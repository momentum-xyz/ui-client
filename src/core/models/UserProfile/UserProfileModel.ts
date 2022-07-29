import {types, Instance, flow} from 'mobx-state-tree';

import {UUIDModel} from 'core/models/UUID';
import {api, UserProfileInterface} from 'api';
import {bytesToUuid} from 'core/utils';
import {UserStatusEnum} from 'core/enums';
import {appVariables} from 'api/constants';

import {RequestModel} from '../Request';

const UserProfileModel = types
  .model('UserProfile', {
    id: UUIDModel,
    userTypeId: types.maybe(UUIDModel),
    name: types.string,
    email: types.maybe(types.string),
    wallet: types.maybeNull(UUIDModel),
    description: types.maybeNull(types.string),
    createdAt: types.maybe(types.string),
    updatedAt: types.maybeNull(types.string),
    profile: types.maybeNull(types.frozen<UserProfileInterface>()),
    isNodeAdmin: types.optional(types.boolean, false),
    inviteRequest: types.optional(RequestModel, {}),
    invited: false,
    status: types.maybe(types.enumeration(Object.values(UserStatusEnum)))
  })
  .views((self) => ({
    get uuid(): string {
      return bytesToUuid(self.id.data);
    },
    get avatarSrc(): string | undefined {
      return (
        self.profile?.avatarHash &&
        `${appVariables.RENDER_SERVICE_URL}/get/${self.profile.avatarHash}`
      );
    }
  }))
  .actions((self) => ({
    invite: flow(function* (spaceId: string) {
      yield self.inviteRequest.send(api.spaceInviteRepository.inviteToSpaceOrTable, {
        spaceId,
        userId: self.uuid,
        isTable: false
      });

      self.invited = true;
    }),
    setInvited(invited: boolean) {
      self.invited = invited;
    }
  }));

export interface UserProfileModelInterface extends Instance<typeof UserProfileModel> {}

export {UserProfileModel};
