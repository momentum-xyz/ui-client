import {types, Instance} from 'mobx-state-tree';

import {appVariables} from 'api/constants';
import {UserProfileModel} from 'core/models/UserProfile';

const AttendeeModel = types
  .model('AttendeeModel', {
    user: UserProfileModel
  })
  .views((self) => ({
    get id() {
      return self.user.uuid;
    },
    get name() {
      return self.user.name;
    },
    get avatarSrc() {
      const avatarHash = self.user.profile?.avatarHash;
      return avatarHash ? `${appVariables.RENDER_SERVICE_URL}/get/${avatarHash}` : undefined;
    }
  }));

export interface AttendeeModelInterface extends Instance<typeof AttendeeModel> {}

export {AttendeeModel};
