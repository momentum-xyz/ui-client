import {types} from 'mobx-state-tree';

import {ResetModel} from 'core/models';

const DefaultStore = types.compose(
  ResetModel,
  types
    .model('DefaultStore', {})
    .actions(() => ({}))
    .views(() => ({}))
);

export {DefaultStore};
