import {types} from 'mobx-state-tree';

import {SpaceStore} from 'stores/MainStore/models';

import {Dashboard} from './DashboardStore/models/Dashboard';
import {CalendarStore} from './CalendarStore';
import {MiroBoardStore} from './MiroBoardStore';
import {GoogleDriveStore} from './GoogleDriveStore';

const RootCollaborationStore = types
  .model('RootCollaborationStore', {
    spaceStore: types.optional(SpaceStore, {}),
    calendarStore: types.optional(CalendarStore, {}),
    dashboard: types.optional(Dashboard, {}),
    miroBoardStore: types.optional(MiroBoardStore, {}),
    googleDriveStore: types.optional(GoogleDriveStore, {})
  })
  .actions((self) => ({
    init(spaceId: string) {
      self.spaceStore.setSpace(spaceId);
      self.spaceStore.fetchSpaceInformation();
      self.dashboard.fetchDashboard(spaceId);
    }
  }));

export {RootCollaborationStore};
