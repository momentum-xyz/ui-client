import {types} from 'mobx-state-tree';

import {DialogModel, ResetModel} from 'core/models';

import {DashboardStore} from './DashboardStore';

const DashboardManagerStore = types.compose(
  ResetModel,
  types
    .model('DashboardManagerStore', {
      editTile: types.optional(DialogModel, {}),
      dashboardStore: types.optional(DashboardStore, {})
    })
    .actions((self) => ({}))
);

export {DashboardManagerStore};
