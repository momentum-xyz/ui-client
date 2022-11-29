import {types} from 'mobx-state-tree';
import {Dialog, ResetModel} from '@momentum-xyz/core';

import {ExploreStore, OnlineUsersStore, UserProfileStore} from './models';

const HomeStore = types.compose(
  ResetModel,
  types.model('HomeStore', {
    onlineUsersStore: types.optional(OnlineUsersStore, {}),
    exploreStore: types.optional(ExploreStore, {}),
    userProfileStore: types.optional(UserProfileStore, {}),
    userProfileDialog: types.optional(Dialog, {})
  })
);

export {HomeStore};
