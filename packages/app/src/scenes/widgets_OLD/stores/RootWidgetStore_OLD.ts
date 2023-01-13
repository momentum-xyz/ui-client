import {Instance, types} from 'mobx-state-tree';

import StakingStore from './StakingStore/StakingStore';
import {WorldStatsStore} from './WorldStatsStore';
import {HelpStore} from './HelpStore';
import {MusicPlayerStore} from './MusicPlayerStore';
import {EmojiStore} from './EmojiStore';

const RootWidgetStore_OLD = types.model('RootWidgetStore_OLD', {
  stakingStore: types.optional(StakingStore, {}),
  worldStatsStore: types.optional(WorldStatsStore, {}),
  helpStore: types.optional(HelpStore, {}),
  musicPlayerStore: types.optional(MusicPlayerStore, {}),
  emojiStore: types.optional(EmojiStore, {})
});
export type RootMeetingSpaceStoreType = Instance<typeof RootWidgetStore_OLD>;

export {RootWidgetStore_OLD};
