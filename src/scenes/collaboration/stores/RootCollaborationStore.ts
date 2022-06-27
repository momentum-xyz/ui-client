import {Instance, types} from 'mobx-state-tree';

import {SpaceStore} from 'stores/MainStore/models';

import {CalendarStore} from './CalendarStore';
import {DashboardStore} from './DashboardManagerStore/DashboardStore';

const RootCollaborationStore = types
  .model('RootCollaborationStore', {
    spaceStore: types.optional(SpaceStore, {}),
    calendarStore: types.optional(CalendarStore, {}),
    dashboardStore: types.optional(DashboardStore, {})
  })
  .actions((self) => ({
    init(spaceId: string) {
      self.spaceStore.setSpace(spaceId);
      self.spaceStore.fetchSpaceInformation();
      self.dashboardStore.fetchDashboard(spaceId);
    }
  }));

export interface RootMeetingSpaceStoreInterface extends Instance<typeof RootCollaborationStore> {}

export {RootCollaborationStore};
