import {types} from 'mobx-state-tree';

import {SpaceStore} from 'stores/MainStore/models';

import {CalendarStore} from './CalendarStore';
import {Dashboard} from './DashboardStore/models/Dashboard';

const RootCollaborationStore = types
  .model('RootCollaborationStore', {
    spaceStore: types.optional(SpaceStore, {}),
    calendarStore: types.optional(CalendarStore, {}),
    dashboard: types.optional(Dashboard, {})
  })
  .actions((self) => ({
    init(spaceId: string) {
      self.spaceStore.setSpace(spaceId);
      self.spaceStore.fetchSpaceInformation();
      self.dashboard.fetchDashboard(spaceId);
    }
  }));

export {RootCollaborationStore};
