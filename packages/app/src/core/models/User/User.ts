import {types, Instance, flow} from 'mobx-state-tree';
import {RequestModel, UserStatusEnum} from '@momentum-xyz/core';
import {ImageSizeEnum} from '@momentum-xyz/ui-kit';

import {api} from 'api';
import {UserProfile} from 'core/models';
import {appVariables} from 'api/constants';

const User = types
  .model('User', {
    id: types.string,
    name: types.string,
    description: types.maybeNull(types.string),
    userTypeId: types.string,
    createdAt: types.string,
    updatedAt: types.maybeNull(types.string),
    wallet: types.maybeNull(types.string),
    status: types.maybeNull(types.enumeration(Object.values(UserStatusEnum))),
    isNodeAdmin: false,
    profile: UserProfile,

    // TODO: Make separate model
    inviteRequest: types.optional(RequestModel, {}),
    invited: false
  })
  .views((self) => ({
    get avatarSrc(): string | undefined {
      return (
        self.profile?.avatarHash &&
        `${appVariables.RENDER_SERVICE_URL}/texture/${ImageSizeEnum.S3}/${self.profile.avatarHash}`
      );
    }
  }))
  .actions((self) => ({
    // TODO: Move to another model
    invite: flow(function* (spaceId: string) {
      yield self.inviteRequest.send(api.spaceInviteRepository.inviteToSpaceOrTable, {
        spaceId,
        userId: self.id,
        isTable: false
      });

      self.invited = true;

      return self.inviteRequest.isDone;
    }),
    // TODO: Move to another model
    setInvited(invited: boolean) {
      self.invited = invited;
    }
  }));

export interface UserModelInterface extends Instance<typeof User> {}

export {User};
