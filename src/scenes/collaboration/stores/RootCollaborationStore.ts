import {types} from 'mobx-state-tree';

import {SpaceStore} from 'stores/MainStore/models';

import {Dashboard} from './DashboardStore/models/Dashboard';
import {CalendarStore} from './CalendarStore';
import {MiroBoardStore} from './MiroBoardStore';
import {DashboardStore} from './DashboardStore';

const RootCollaborationStore = types
  .model('RootCollaborationStore', {
    spaceStore: types.optional(SpaceStore, {}),
    calendarStore: types.optional(CalendarStore, {}),
    dashboard: types.optional(Dashboard, {}),
    dashboardStore: types.optional(DashboardStore, {}),
    miroBoardStore: types.optional(MiroBoardStore, {})
  })
  .actions((self) => ({
    init(spaceId: string) {
      self.spaceStore.setSpace(spaceId);
      self.spaceStore.fetchSpaceInformation();
      self.dashboardStore.dashboard.fetchDashboard(spaceId);
    }
  }));

export {RootCollaborationStore};
