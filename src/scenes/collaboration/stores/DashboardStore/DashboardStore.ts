import {types} from 'mobx-state-tree';

import {DialogModel, ResetModel, TileList} from 'core/models';

import {Dashboard} from './models/Dashboard';

const DashboardStore = types.compose(
  ResetModel,
  types
    .model('DashboardStore', {
      tileDialog: types.optional(DialogModel, {}),
      tileList: types.optional(TileList, {}),
      dashboard: types.optional(Dashboard, {})
    })
    .actions((self) => ({}))
);

export {DashboardStore};
