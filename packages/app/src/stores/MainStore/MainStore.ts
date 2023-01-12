import {types} from 'mobx-state-tree';
import {ResetModel} from '@momentum-xyz/core';

import {WorldStore} from './models';

const MainStore = types.compose(
  ResetModel,
  types.model('MainStore', {
    worldStore: types.optional(WorldStore, {})
  })
);

export {MainStore};
