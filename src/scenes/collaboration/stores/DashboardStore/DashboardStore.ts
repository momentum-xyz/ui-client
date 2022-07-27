import {types} from 'mobx-state-tree';

import {DialogModel, ResetModel, TileList} from 'core/models';

import {Dashboard} from './models/Dashboard';
import {TileFormStore} from './models/TileFormStore';

const DashboardStore = types.compose(
  ResetModel,
  types
    .model('DashboardStore', {
      tileDialog: types.optional(DialogModel, {}),
      tileRemoveDialog: types.optional(DialogModel, {}),
      tileList: types.optional(TileList, {}),
      dashboard: types.optional(Dashboard, {}),
      tileFormStore: types.optional(TileFormStore, {})
    })
    .actions((self) => ({}))
);

export {DashboardStore};
