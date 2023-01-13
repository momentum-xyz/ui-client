import {types} from 'mobx-state-tree';

import {SpaceManagerStore} from './SpaceManagerStore';
import {BroadcastStore} from './BroadcastStore';
import {ManageEmojiStore} from './ManageEmojiStore';
import {ManagePluginsStore} from './ManagePluginsStore';

const RootSpaceAdminStore = types.model('RootSpaceAdminStore', {
  spaceManagerStore: types.optional(SpaceManagerStore, {}),
  broadcastStore: types.optional(BroadcastStore, {}),
  manageEmojiStore: types.optional(ManageEmojiStore, {}),
  managePluginsStore: types.optional(ManagePluginsStore, {})
});

export {RootSpaceAdminStore};
