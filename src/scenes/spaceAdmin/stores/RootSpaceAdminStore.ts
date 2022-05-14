import {Instance, types} from 'mobx-state-tree';

import {SpaceManagerStore} from './SpaceManagerStore';
import {BroadcastStore} from './BroadcastStore';

const RootSpaceAdminStore = types.model('RootSpaceAdminStore', {
  spaceManagerStore: types.optional(SpaceManagerStore, {}),
  broadcastStore: types.optional(BroadcastStore, {})
});

export interface RootMeetingSpaceStoreInterface extends Instance<typeof RootSpaceAdminStore> {}

export {RootSpaceAdminStore};
