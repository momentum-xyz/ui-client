import {Instance, types} from 'mobx-state-tree';

import {UserProfileModel} from 'core/models';

const OnlineUsersList = types.model('OnlineUsersList', {
  users: types.optional(types.array(UserProfileModel), []),
  searchQuery: '',
  searchedUsers: types.optional(types.array(UserProfileModel), [])
});

export interface OnlineUsersListInterface extends Instance<typeof OnlineUsersList> {}

export {OnlineUsersList};
