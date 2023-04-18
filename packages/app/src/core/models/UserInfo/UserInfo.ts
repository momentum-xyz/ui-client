import {Instance, types} from 'mobx-state-tree';

import {UserProfile} from 'core/models';

const UserInfo = types.model('UserInfo', {
  id: types.identifier,
  name: types.string,
  description: types.maybe(types.string),
  profile: UserProfile
});

export interface UserInfoModelInterface extends Instance<typeof UserInfo> {}

export {UserInfo};
