import {types} from 'mobx-state-tree';

import {SignInStore} from './SignInStore';
import {ProfileStore} from './ProfileStore';
import {WorldDetailsStore} from './WorldDetailsStore';
import {UserDetailsStore} from './UserDetailsStore';
import {StakingViewStore} from './StakingViewStore';

const WidgetsStore = types.model('WidgetsStore', {
  signInStore: types.optional(SignInStore, {}),
  profileStore: types.optional(ProfileStore, {}),
  worldDetailsStore: types.optional(WorldDetailsStore, {}),
  userDetailsStore: types.optional(UserDetailsStore, {}),
  stakingViewStore: types.optional(StakingViewStore, {})
});

export {WidgetsStore};
