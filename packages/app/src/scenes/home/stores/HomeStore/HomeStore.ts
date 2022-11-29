import {types} from 'mobx-state-tree';
import {Dialog, ResetModel} from '@momentum-xyz/core';

import {ExploreStore, OnlineUsersStore, UserProfileStore, FlyToMeStore} from './models';

const HomeStore = types.compose(
  ResetModel,
  types.model('HomeStore', {
    onlineUsersStore: types.optional(OnlineUsersStore, {}),
    exploreStore: types.optional(ExploreStore, {}),
    userProfileStore: types.optional(UserProfileStore, {}),
    userProfileDialog: types.optional(Dialog, {}),

    // TODO: FlyTo. Movement after getting design
    flyToMeStore: types.optional(FlyToMeStore, {})
  })
);

export {HomeStore};
