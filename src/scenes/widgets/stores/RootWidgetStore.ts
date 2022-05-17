import {Instance, types} from 'mobx-state-tree';

import StakingStore from './StakingStore/StakingStore';
import {WorldStatsStore} from './WorldStatsStore';
import {MagicLinkStore} from './MagicLinkStore';
import {ProfileMenuStore} from './ProfileMenuStore';
import {TokenRulesStore} from './TokenRulesStore';
import {ProfileStore} from './ProfileStore';
import {HelpStore} from './HelpStore';
import {LaunchInitiativeStore} from './LaunchInitiativeStore';
import {SettingsStore} from './SettingsStore';
import {OnlineUsersStore} from './OnlineUsersStore';
import {ExploreStore} from './ExploreStore';

const RootWidgetStore = types.model('RootWidgetStore', {
  magicLinkStore: types.optional(MagicLinkStore, {}),
  stakingStore: types.optional(StakingStore, {}),
  worldStatsStore: types.optional(WorldStatsStore, {}),
  helpStore: types.optional(HelpStore, {}),
  profileStore: types.optional(ProfileStore, {}),
  profileMenuStore: types.optional(ProfileMenuStore, {}),
  tokenRulesStore: types.optional(TokenRulesStore, {}),
  launchInitiativeStore: types.optional(LaunchInitiativeStore, {}),
  settingsStore: types.optional(SettingsStore, {}),
  onlineUsersStore: types.optional(OnlineUsersStore, {}),
  exploreStore: types.optional(ExploreStore, {})
});

export interface RootMeetingSpaceStoreInterface extends Instance<typeof RootWidgetStore> {}

export {RootWidgetStore};
