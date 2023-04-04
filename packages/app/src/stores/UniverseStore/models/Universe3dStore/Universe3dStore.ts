import {types} from 'mobx-state-tree';
import {ResetModel} from '@momentum-xyz/core';

const Universe3dStore = types.compose(
  ResetModel,
  types
    .model('Universe3dStore', {
      // props related to 3d part of the universe
    })
    .actions(() => ({}))
    .views(() => ({}))
);

export {Universe3dStore};
