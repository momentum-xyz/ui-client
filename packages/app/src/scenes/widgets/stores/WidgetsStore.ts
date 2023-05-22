import {types} from 'mobx-state-tree';

import {SignInStore} from './SignInStore';
import {ProfileStore} from './ProfileStore';
import {WorldDetailsStore} from './WorldDetailsStore';
import {UserDetailsStore} from './UserDetailsStore';
import {StakingViewStore} from './StakingViewStore';
import {WorldProfileStore} from './WorldProfileStore';
import {CreatorStore} from './CreatorStore';
import {NewsfeedStore} from './NewsfeedStore';

const WidgetsStore = types.model('WidgetsStore', {
  signInStore: types.optional(SignInStore, {}),
  profileStore: types.optional(ProfileStore, {}),
  worldProfileStore: types.optional(WorldProfileStore, {}),
  worldDetailsStore: types.optional(WorldDetailsStore, {}),
  userDetailsStore: types.optional(UserDetailsStore, {}),
  stakingViewStore: types.optional(StakingViewStore, {}),
  newsfeedStore: types.optional(NewsfeedStore, {}),
  creatorStore: types.optional(CreatorStore, {})
});

export {WidgetsStore};
