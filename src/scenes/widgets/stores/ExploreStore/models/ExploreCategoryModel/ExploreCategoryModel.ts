import {Instance, types} from 'mobx-state-tree';

import {SpaceModel} from 'core/models';

const ExploreCategoryModel = types.model('ExploreCategoryModel', {
  name: types.string,
  spaces: types.optional(types.array(types.optional(SpaceModel, {})), [])
});

export interface ExploreCategoryModelInterface extends Instance<typeof ExploreCategoryModel> {}

export {ExploreCategoryModel};
