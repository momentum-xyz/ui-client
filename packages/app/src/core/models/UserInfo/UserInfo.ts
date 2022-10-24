import {Instance, types} from 'mobx-state-tree';

const UserInfo = types.model('UserInfo', {
  id: types.string,
  name: types.string,
  isAdmin: false
});

export interface UserInfoModelInterface extends Instance<typeof UserInfo> {}

export {UserInfo};
