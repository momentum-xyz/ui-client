import {Instance, types} from 'mobx-state-tree';
import {ImageSizeEnum, UserStatusEnum} from '@momentum-xyz/ui-kit-storybook';

import {UserProfile} from 'core/models';
import {getImageAbsoluteUrl} from 'core/utils';

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
    profile: UserProfile,
    isGuest: types.maybe(types.boolean)
  })
  .views((self) => ({
    get avatarSrc(): string | undefined {
      return getImageAbsoluteUrl(self.profile.avatarHash) || undefined;
    },
    get avatarLargeSrc(): string | undefined {
      return getImageAbsoluteUrl(self.profile.avatarHash, ImageSizeEnum.S5) || undefined;
    }
  }));

export interface UserModelInterface extends Instance<typeof User> {}

export {User};
