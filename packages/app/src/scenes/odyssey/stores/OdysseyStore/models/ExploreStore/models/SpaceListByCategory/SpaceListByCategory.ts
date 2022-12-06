import {Instance, types} from 'mobx-state-tree';

import {SpaceInfo} from 'core/models';

const SpaceListByCategory = types.model('SpaceListByCategory', {
  name: types.string,
  spaceList: types.optional(types.array(SpaceInfo), [])
});

export interface SpaceListByCategoryModelInterface extends Instance<typeof SpaceListByCategory> {}

export {SpaceListByCategory};
