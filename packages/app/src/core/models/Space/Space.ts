import {Instance, types} from 'mobx-state-tree';

const Space = types.model('Space', {
  id: types.string,
  name: types.string,
  description: types.maybeNull(types.string),
  type: types.maybeNull(types.string),
  parentId: types.maybeNull(types.string),
  isTable: false,
  isPrivate: false
});

export type SpaceModelType = Instance<typeof Space>;

export {Space};
