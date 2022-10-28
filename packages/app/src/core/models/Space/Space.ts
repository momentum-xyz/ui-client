import {types} from 'mobx-state-tree';

const Space = types.model('Space', {
  id: types.string,
  name: types.string,
  description: types.maybeNull(types.string),
  type: types.maybeNull(types.string),
  parentId: types.maybeNull(types.string),
  isPrivate: false
});

export {Space};
