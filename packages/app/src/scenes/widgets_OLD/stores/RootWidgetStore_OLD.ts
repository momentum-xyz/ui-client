import {Instance, types} from 'mobx-state-tree';

import {HelpStore} from './HelpStore';
import {MusicPlayerStore} from './MusicPlayerStore';
import {EmojiStore} from './EmojiStore';

const RootWidgetStore_OLD = types.model('RootWidgetStore_OLD', {
  helpStore: types.optional(HelpStore, {}),
  musicPlayerStore: types.optional(MusicPlayerStore, {}),
  emojiStore: types.optional(EmojiStore, {})
});
export type RootMeetingSpaceStoreType = Instance<typeof RootWidgetStore_OLD>;

export {RootWidgetStore_OLD};
