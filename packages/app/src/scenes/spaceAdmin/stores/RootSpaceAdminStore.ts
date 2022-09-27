import {Instance, types} from 'mobx-state-tree';

import {SpaceManagerStore} from './SpaceManagerStore';
import {BroadcastStore} from './BroadcastStore';
import {ManageEmojiStore} from './ManageEmojiStore';

const RootSpaceAdminStore = types.model('RootSpaceAdminStore', {
  spaceManagerStore: types.optional(SpaceManagerStore, {}),
  broadcastStore: types.optional(BroadcastStore, {}),
  manageEmojiStore: types.optional(ManageEmojiStore, {})
});

export interface RootMeetingSpaceStoreInterface extends Instance<typeof RootSpaceAdminStore> {}

export {RootSpaceAdminStore};
