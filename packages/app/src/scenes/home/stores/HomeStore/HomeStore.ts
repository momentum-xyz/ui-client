import {types} from 'mobx-state-tree';
import {ResetModel} from '@momentum-xyz/core';

import {ExploreStore, OnlineUsersStore} from './models';

const HomeStore = types.compose(
  ResetModel,
  types.model('HomeStore', {
    onlineUsersStore: types.optional(OnlineUsersStore, {}),
    exploreStore: types.optional(ExploreStore, {})
  })
);

export {HomeStore};
