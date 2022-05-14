import {Instance, types} from 'mobx-state-tree';

import {WorldCalendarStore} from './WorldCalendarStore';

const RootWorldCalendarStore = types
  .model('RootWorldCalendarStore', {
    calendarStore: types.optional(WorldCalendarStore, {})
  })
  .actions(() => ({}))
  .views(() => ({}));

export interface RootWorldCalendarStoreInterface extends Instance<typeof RootWorldCalendarStore> {}

export {RootWorldCalendarStore};
