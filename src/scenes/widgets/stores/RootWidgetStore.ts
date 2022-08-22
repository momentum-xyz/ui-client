import {Instance, types} from 'mobx-state-tree';

import StakingStore from './StakingStore/StakingStore';
import {WorldStatsStore} from './WorldStatsStore';
import {MagicLinkStore} from './MagicLinkStore';
import {ProfileMenuStore} from './ProfileMenuStore';
import {ProfileStore} from './ProfileStore';
import {HelpStore} from './HelpStore';
import {LaunchInitiativeStore} from './LaunchInitiativeStore';
import {MusicPlayerStore} from './MusicPlayerStore';
import {AttendeesListStore} from './AttendeesListStore';

const RootWidgetStore = types.model('RootWidgetStore', {
  magicLinkStore: types.optional(MagicLinkStore, {}),
  stakingStore: types.optional(StakingStore, {}),
  worldStatsStore: types.optional(WorldStatsStore, {}),
  helpStore: types.optional(HelpStore, {}),
  profileStore: types.optional(ProfileStore, {}),
  profileMenuStore: types.optional(ProfileMenuStore, {}),
  launchInitiativeStore: types.optional(LaunchInitiativeStore, {}),
  musicPlayerStore: types.optional(MusicPlayerStore, {}),
  attendeesListStore: types.optional(AttendeesListStore, {})
});

export interface RootMeetingSpaceStoreInterface extends Instance<typeof RootWidgetStore> {}

export {RootWidgetStore};
