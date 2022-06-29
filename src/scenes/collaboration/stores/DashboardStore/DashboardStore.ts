import {types} from 'mobx-state-tree';

import {ResetModel} from 'core/models';

import {Dashboard} from './models/Dashboard';

const DashboardStore = types.compose(
  ResetModel,
  types
    .model('DashboardStore', {
      dashboardStore: types.optional(Dashboard, {})
    })
    .actions((self) => ({}))
    .views((self) => ({}))
);

export {DashboardStore};
