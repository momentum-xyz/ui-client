import {types} from 'mobx-state-tree';

import {Space} from 'core/models';

import {CalendarStore} from './CalendarStore';
import {Dashboard} from './DashboardStore/models/Dashboard';

const RootCollaborationStore = types
  .model('RootCollaborationStore', {
    space: types.optional(Space, {}),
    calendarStore: types.optional(CalendarStore, {}),
    dashboard: types.optional(Dashboard, {})
  })
  .actions((self) => ({
    init(spaceId: string) {
      self.space.setup(spaceId);
      self.space.fetchSpaceInformation();
      self.dashboard.fetchDashboard(spaceId);
    }
  }));

export {RootCollaborationStore};
