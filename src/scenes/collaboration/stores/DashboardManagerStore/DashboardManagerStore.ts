import {types} from 'mobx-state-tree';

import {DialogModel, ResetModel} from 'core/models';

const DashboardManagerStore = types.compose(
  ResetModel,
  types
    .model('DashboardManagerStore', {
      editTile: types.optional(DialogModel, {})
    })
    .actions((self) => ({}))
);

export {DashboardManagerStore};
