import {types} from 'mobx-state-tree';

import {SpaceStore} from 'stores/MainStore/models';

import {CalendarStore} from './CalendarStore';
import {Dashboard} from './DashboardStore/models/Dashboard';
import {DashboardStore} from './DashboardStore';

const RootCollaborationStore = types
  .model('RootCollaborationStore', {
    spaceStore: types.optional(SpaceStore, {}),
    calendarStore: types.optional(CalendarStore, {}),
    dashboard: types.optional(Dashboard, {}),
    dashboardManager: types.optional(DashboardStore, {})
  })
  .actions((self) => ({
    init(spaceId: string) {
      self.spaceStore.setSpace(spaceId);
      self.spaceStore.fetchSpaceInformation();
      self.dashboardManager.dashboard.fetchDashboard(spaceId);
    }
  }));

export {RootCollaborationStore};
