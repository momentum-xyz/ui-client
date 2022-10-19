import {types, Instance} from 'mobx-state-tree';
import {ImageSizeEnum} from '@momentum-xyz/ui-kit';

import {appVariables} from 'api/constants';
import {UserProfileModel} from 'core/models/UserProfile';

const AttendeeModel = types
  .model('AttendeeModel', {
    user: UserProfileModel
  })
  .views((self) => ({
    get id() {
      return self.user.id;
    },
    get name() {
      return self.user.name;
    },
    get avatarSrc(): string | undefined {
      return (
        self.user.profile?.avatarHash &&
        `${appVariables.RENDER_SERVICE_URL}/texture/${ImageSizeEnum.S3}/${self.user.profile?.avatarHash}`
      );
    }
  }));

export interface AttendeeModelInterface extends Instance<typeof AttendeeModel> {}

export {AttendeeModel};
