import {types} from 'mobx-state-tree';

const SpaceInfo = types.model('SpaceInfo', {
  id: types.string,
  name: types.string,
  hasSubspaces: false
});

export {SpaceInfo};
