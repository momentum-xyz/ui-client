import {Instance, types} from 'mobx-state-tree';

import StakingStore from './StakingStore/StakingStore';
import {WorldStatsStore} from './WorldStatsStore';
import {HelpStore} from './HelpStore';
import {LaunchInitiativeStore} from './LaunchInitiativeStore';
import {MusicPlayerStore} from './MusicPlayerStore';
import {EmojiStore} from './EmojiStore';
import {ProfileMenuStore} from './ProfileMenuStore';

const RootWidgetStore_OLD = types.model('RootWidgetStore_OLD', {
  stakingStore: types.optional(StakingStore, {}),
  worldStatsStore: types.optional(WorldStatsStore, {}),
  helpStore: types.optional(HelpStore, {}),
  launchInitiativeStore: types.optional(LaunchInitiativeStore, {}),
  profileMenuStore: types.optional(ProfileMenuStore, {}), // TODO: OLD
  musicPlayerStore: types.optional(MusicPlayerStore, {}),
  emojiStore: types.optional(EmojiStore, {})
});
export type RootMeetingSpaceStoreType = Instance<typeof RootWidgetStore_OLD>;

export {RootWidgetStore_OLD};
