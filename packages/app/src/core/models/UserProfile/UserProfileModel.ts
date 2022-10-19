import {types, Instance, flow} from 'mobx-state-tree';
import {RequestModel, UserStatusEnum} from '@momentum-xyz/core';
import {ImageSizeEnum} from '@momentum-xyz/ui-kit';

import {api, UserProfileInterface} from 'api';
import {appVariables} from 'api/constants';

const UserProfileModel = types
  .model('UserProfile', {
    id: types.string,
    name: types.string,
    description: types.maybeNull(types.string),
    userTypeId: types.string,
    createdAt: types.string,
    updatedAt: types.maybeNull(types.string),
    wallet: types.maybeNull(types.string),
    isNodeAdmin: false,
    status: types.maybeNull(types.enumeration(Object.values(UserStatusEnum))),

    // TODO: Make model
    profile: types.frozen<UserProfileInterface>(),

    // TODO: Make separate model
    inviteRequest: types.optional(RequestModel, {}),
    invited: false
  })
  .views((self) => ({
    get uuid(): string {
      return self.id;
    },
    get avatarSrc(): string | undefined {
      return (
        self.profile?.avatarHash &&
        `${appVariables.RENDER_SERVICE_URL}/texture/${ImageSizeEnum.S3}/${self.profile.avatarHash}`
      );
    }
  }))
  // TODO: Move all to another model
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
