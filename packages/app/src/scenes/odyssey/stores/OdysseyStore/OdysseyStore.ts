import {types} from 'mobx-state-tree';
import {Dialog, ResetModel} from '@momentum-xyz/core';

import {ExploreStore, OnlineUsersStore, UserProfileStore} from './models';

const OdysseyStore = types.compose(
  ResetModel,
  types.model('OdysseyStore', {
    // TODO: Removal
    onlineUsersStore: types.optional(OnlineUsersStore, {}),
    // TODO: Removal
    exploreStore: types.optional(ExploreStore, {}),
    // TODO: Removal
    userProfileStore: types.optional(UserProfileStore, {}),
    // TODO: Removal
    userProfileDialog: types.optional(Dialog, {})
  })
);

export {OdysseyStore};
