import {Instance, types} from 'mobx-state-tree';

const SpaceUserModel = types.model('SpaceUser', {
  id: types.string,
  name: types.string,
  isAdmin: types.maybe(types.boolean)
});

export interface SpaceUserModelInterface extends Instance<typeof SpaceUserModel> {}

export {SpaceUserModel};
