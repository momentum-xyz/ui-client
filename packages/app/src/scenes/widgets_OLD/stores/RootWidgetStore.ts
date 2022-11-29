import {Instance, types} from 'mobx-state-tree';

import StakingStore from './StakingStore/StakingStore';
import {WorldStatsStore} from './WorldStatsStore';
import {MagicLinkStore} from './MagicLinkStore';
import {HelpStore} from './HelpStore';
import {LaunchInitiativeStore} from './LaunchInitiativeStore';
import {MusicPlayerStore} from './MusicPlayerStore';
import {EmojiStore} from './EmojiStore';

const RootWidgetStore = types.model('RootWidgetStore', {
  magicLinkStore: types.optional(MagicLinkStore, {}),
  stakingStore: types.optional(StakingStore, {}),
  worldStatsStore: types.optional(WorldStatsStore, {}),
  helpStore: types.optional(HelpStore, {}),
  launchInitiativeStore: types.optional(LaunchInitiativeStore, {}),
  musicPlayerStore: types.optional(MusicPlayerStore, {}),
  emojiStore: types.optional(EmojiStore, {})
});
export type RootMeetingSpaceStoreType = Instance<typeof RootWidgetStore>;

export {RootWidgetStore};
