import {types} from 'mobx-state-tree';

import {ResetModel, TileList} from 'core/models';

import {Dashboard} from './models/Dashboard';

const DashboardStore = types.compose(
  ResetModel,
  types
    .model('DashboardStore', {
      tileList: types.optional(TileList, {}),
      dashboard: types.optional(Dashboard, {})
    })
    .actions((self) => ({}))
);

export {DashboardStore};
