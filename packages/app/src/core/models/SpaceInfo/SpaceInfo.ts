import {Instance, types} from 'mobx-state-tree';

const SpaceInfo = types.model('SpaceInfo', {
  id: types.string,
  name: types.string,
  hasSubspaces: false
});

export interface SpaceInfoModelInterface extends Instance<typeof SpaceInfo> {}

export {SpaceInfo};
