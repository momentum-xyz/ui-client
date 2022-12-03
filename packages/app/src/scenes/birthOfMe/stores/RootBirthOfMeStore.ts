import {types} from 'mobx-state-tree';
import {ResetModel} from '@momentum-xyz/core';

import {ExploreStore} from './ExploreStore';

const RootBirthOfMeStore = types.compose(
  ResetModel,
  types.model('RootBirthOfMeStore', {
    exploreStore: types.optional(ExploreStore, {})
  })
);
export {RootBirthOfMeStore};
