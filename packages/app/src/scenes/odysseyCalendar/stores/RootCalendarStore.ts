import {Instance, types} from 'mobx-state-tree';

import {OdysseyCalendarStore} from './OdysseyCalendarStore';

const RootCalendarStore = types.model('RootWorldCalendarStore', {
  odysseyCalendarStore: types.optional(OdysseyCalendarStore, {})
});

export type RootCalendarStoreType = Instance<typeof RootCalendarStore>;

export {RootCalendarStore};
