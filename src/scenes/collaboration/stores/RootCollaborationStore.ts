import {Instance, types} from 'mobx-state-tree';

import {SpaceStore} from 'stores/MainStore/models';

import {CalendarStore} from './CalendarStore';

const RootCollaborationStore = types
  .model('RootCollaborationStore', {
    spaceStore: types.optional(SpaceStore, {}),
    calendarStore: types.optional(CalendarStore, {})
  })
  .actions((self) => ({
    init(spaceId: string) {
      self.spaceStore.setSpace(spaceId);
      self.spaceStore.fetchSpaceInformation();
    }
  }));

export interface RootMeetingSpaceStoreInterface extends Instance<typeof RootCollaborationStore> {}

export {RootCollaborationStore};
