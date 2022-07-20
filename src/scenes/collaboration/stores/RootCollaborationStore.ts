import {Instance, types} from 'mobx-state-tree';

import {FavoriteStore, SpaceStore} from 'stores/MainStore/models';

import {CalendarStore} from './CalendarStore';
import {Dashboard} from './DashboardStore/models/Dashboard';

const RootCollaborationStore = types
  .model('RootCollaborationStore', {
    spaceStore: types.optional(SpaceStore, {}),
    calendarStore: types.optional(CalendarStore, {}),
    dashboard: types.optional(Dashboard, {}),
    favoriteStore: types.optional(FavoriteStore, {})
  })
  .actions((self) => ({
    init(spaceId: string) {
      self.favoriteStore.setSpaceId(spaceId);
      self.spaceStore.setSpace(spaceId);
      self.spaceStore.fetchSpaceInformation();
      self.dashboard.fetchDashboard(spaceId);
    }
  }));

export interface RootMeetingSpaceStoreInterface extends Instance<typeof RootCollaborationStore> {}

export {RootCollaborationStore};
