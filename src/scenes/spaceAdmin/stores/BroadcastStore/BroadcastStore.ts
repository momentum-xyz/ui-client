import {types} from 'mobx-state-tree';

import {ResetModel} from 'core/models';

const BroadcastStore = types.compose(
  ResetModel,
  types.model('BroadcastStore', {
    // add models and stores
  })
);

export {BroadcastStore};
