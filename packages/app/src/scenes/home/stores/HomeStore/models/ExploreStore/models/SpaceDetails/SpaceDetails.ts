import {types} from 'mobx-state-tree';

import {SpaceInfo} from 'core/models';

const SpaceDetails = types.model('SpaceDetails', {
  id: types.string,
  name: types.string,
  description: types.maybeNull(types.string),
  subSpaces: types.optional(types.array(SpaceInfo), [])
});

export {SpaceDetails};
