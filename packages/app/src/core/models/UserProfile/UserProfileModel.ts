import {types, Instance, flow} from 'mobx-state-tree';
import {RequestModel, UUIDModel, UserStatusEnum} from '@momentum-xyz/core';
import {ImageSizeEnum} from '@momentum-xyz/ui-kit';

import {api, UserProfileInterface} from 'api';
import {bytesToUuid} from 'core/utils';
import {appVariables} from 'api/constants';

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
        `${appVariables.RENDER_SERVICE_URL}/texture/${ImageSizeEnum.S3}/${self.profile.avatarHash}`
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

      return self.inviteRequest.isDone;
    }),
    setInvited(invited: boolean) {
      self.invited = invited;
    }
  }));

export interface UserProfileModelInterface extends Instance<typeof UserProfileModel> {}

export {UserProfileModel};
