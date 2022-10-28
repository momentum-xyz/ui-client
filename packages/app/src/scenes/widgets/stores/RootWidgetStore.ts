import {Instance, types} from 'mobx-state-tree';

import StakingStore from './StakingStore/StakingStore';
import {WorldStatsStore} from './WorldStatsStore';
import {MagicLinkStore} from './MagicLinkStore';
import {ProfileMenuStore} from './ProfileMenuStore';
import {HelpStore} from './HelpStore';
import {LaunchInitiativeStore} from './LaunchInitiativeStore';
import {MusicPlayerStore} from './MusicPlayerStore';
import {AttendeesListStore} from './AttendeesListStore';
import {EmojiStore} from './EmojiStore';

const RootWidgetStore = types.model('RootWidgetStore', {
  magicLinkStore: types.optional(MagicLinkStore, {}),
  stakingStore: types.optional(StakingStore, {}),
  worldStatsStore: types.optional(WorldStatsStore, {}),
  helpStore: types.optional(HelpStore, {}),
  profileMenuStore: types.optional(ProfileMenuStore, {}),
  launchInitiativeStore: types.optional(LaunchInitiativeStore, {}),
  musicPlayerStore: types.optional(MusicPlayerStore, {}),
  attendeesListStore: types.optional(AttendeesListStore, {}),
  emojiStore: types.optional(EmojiStore, {})
});
export type RootMeetingSpaceStoreType = Instance<typeof RootWidgetStore>;

export {RootWidgetStore};
