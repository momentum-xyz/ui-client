import {types} from 'mobx-state-tree';

import {LoginStore} from './LoginStore';
import {ProfileStore} from './ProfileStore';
import {WorldDetailsStore} from './WorldDetailsStore';
import {UserDetailsStore} from './UserDetailsStore';
import {StakingViewStore} from './StakingViewStore';
import {WorldProfileStore} from './WorldProfileStore';
import {CreatorStore} from './CreatorStore';
import {NewsfeedStore} from './NewsfeedStore';
import {TimelineStore} from './TimelineStore';

const WidgetsStore = types.model('WidgetsStore', {
  loginStore: types.optional(LoginStore, {}),
  profileStore: types.optional(ProfileStore, {}),
  worldProfileStore: types.optional(WorldProfileStore, {}),
  worldDetailsStore: types.optional(WorldDetailsStore, {}),
  userDetailsStore: types.optional(UserDetailsStore, {}),
  stakingViewStore: types.optional(StakingViewStore, {}),
  newsfeedStore: types.optional(NewsfeedStore, {}),
  timelineStore: types.optional(TimelineStore, {}),
  creatorStore: types.optional(CreatorStore, {})
});

export {WidgetsStore};
