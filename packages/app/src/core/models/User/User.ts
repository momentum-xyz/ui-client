import {types, Instance} from 'mobx-state-tree';
import {ImageSizeEnum, UserStatusEnum} from '@momentum-xyz/ui-kit';

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
    wallets: types.maybeNull(types.array(types.string)),
    status: types.maybeNull(types.enumeration(Object.values(UserStatusEnum))),
    profile: UserProfile,
    isGuest: types.maybe(types.boolean)
  })
  .views((self) => ({
    get avatarSrc(): string | undefined {
      return (
        self.profile.avatarHash &&
        `${appVariables.RENDER_SERVICE_URL}/texture/${ImageSizeEnum.S3}/${self.profile.avatarHash}`
      );
    }
  }));

export interface UserModelInterface extends Instance<typeof User> {}

export {User};
