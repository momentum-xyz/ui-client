import {Instance, types} from 'mobx-state-tree';

const Object = types.model('Object', {
  id: types.string,
  name: types.string,
  description: types.maybeNull(types.string),
  type: types.maybeNull(types.string),
  parentId: types.maybeNull(types.string),
  isTable: false,
  isPrivate: false
});

export type ObjectModelType = Instance<typeof Object>;

export {Object};
