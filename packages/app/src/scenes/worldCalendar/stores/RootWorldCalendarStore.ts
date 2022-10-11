import {Instance, types} from 'mobx-state-tree';

import {WorldCalendarStore} from './WorldCalendarStore';

const RootWorldCalendarStore = types
  .model('RootWorldCalendarStore', {
    calendarStore: types.optional(WorldCalendarStore, {})
  })
  .actions(() => ({}))
  .views(() => ({}));

export type RootWorldCalendarStoreType = Instance<typeof RootWorldCalendarStore>;

export {RootWorldCalendarStore};
