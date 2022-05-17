import {Instance, types} from 'mobx-state-tree';

const SubSpaceModel = types.model('SpaceUser', {
  id: types.string,
  name: types.string,
  hasSubspaces: false
});

export interface SubSpaceModelInterface extends Instance<typeof SubSpaceModel> {}

export {SubSpaceModel};
