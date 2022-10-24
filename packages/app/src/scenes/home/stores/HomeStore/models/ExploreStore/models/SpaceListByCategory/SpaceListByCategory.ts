import {types} from 'mobx-state-tree';

import {SpaceInfo} from 'core/models';

const SpaceListByCategory = types.model('SpaceListByCategory', {
  name: types.string,
  spaces: types.optional(types.array(SpaceInfo), [])
});

export {SpaceListByCategory};
