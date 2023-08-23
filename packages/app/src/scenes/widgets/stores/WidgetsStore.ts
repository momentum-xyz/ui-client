import {types} from 'mobx-state-tree';

import {LoginStore} from './LoginStore';
import {ProfileStore} from './ProfileStore';
import {WorldDetailsStore} from './WorldDetailsStore';
import {UserDetailsStore} from './UserDetailsStore';
import {StakingViewStore} from './StakingViewStore';
import {CreatorStore} from './CreatorStore';
import {NewsfeedStore} from './NewsfeedStore';
import {TimelineStore} from './TimelineStore';
import {ContributionFormsStore} from './ContributionFormsStore';

const WidgetsStore = types.model('WidgetsStore', {
  loginStore: types.optional(LoginStore, {}),
  profileStore: types.optional(ProfileStore, {}),
  worldDetailsStore: types.optional(WorldDetailsStore, {}),
  userDetailsStore: types.optional(UserDetailsStore, {}),
  stakingViewStore: types.optional(StakingViewStore, {}),
  newsfeedStore: types.optional(NewsfeedStore, {}),
  timelineStore: types.optional(TimelineStore, {}),
  creatorStore: types.optional(CreatorStore, {}),
  contributionFormsStore: types.optional(ContributionFormsStore, {})
});

export {WidgetsStore};
