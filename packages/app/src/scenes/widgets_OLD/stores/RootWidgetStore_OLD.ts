import {Instance, types} from 'mobx-state-tree';

import {WorldStatsStore} from './WorldStatsStore';
import {HelpStore} from './HelpStore';
import {MusicPlayerStore} from './MusicPlayerStore';
import {EmojiStore} from './EmojiStore';

const RootWidgetStore_OLD = types.model('RootWidgetStore_OLD', {
  worldStatsStore: types.optional(WorldStatsStore, {}),
  helpStore: types.optional(HelpStore, {}),
  musicPlayerStore: types.optional(MusicPlayerStore, {}),
  emojiStore: types.optional(EmojiStore, {})
});
export type RootMeetingSpaceStoreType = Instance<typeof RootWidgetStore_OLD>;

export {RootWidgetStore_OLD};
