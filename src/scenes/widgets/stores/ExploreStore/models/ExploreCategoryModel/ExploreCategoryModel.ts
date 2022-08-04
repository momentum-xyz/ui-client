import {Instance, types} from 'mobx-state-tree';

import {Space} from 'core/models';

const ExploreCategoryModel = types.model('ExploreCategoryModel', {
  name: types.string,
  spaces: types.optional(types.array(Space), [])
});

export interface ExploreCategoryModelInterface extends Instance<typeof ExploreCategoryModel> {}

export {ExploreCategoryModel};
