import {types} from 'mobx-state-tree';

import {SignInStore} from './SignInStore';
import {StakingViewStore} from './StakingViewStore';
import {ProfileStore} from './ProfileStore';

const WidgetsStore = types.model('WidgetsStore', {
  signInStore: types.optional(SignInStore, {}),
  stakingViewStore: types.optional(StakingViewStore, {}),
  profileStore: types.optional(ProfileStore, {})
});

export {WidgetsStore};
