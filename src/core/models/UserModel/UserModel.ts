import {Instance, types} from 'mobx-state-tree';

const UserModel = types.model('UserModel', {
  id: types.string,
  name: types.string,
  isAdmin: types.maybe(types.boolean)
});

export interface UserModelInterface extends Instance<typeof UserModel> {}

export {UserModel};
