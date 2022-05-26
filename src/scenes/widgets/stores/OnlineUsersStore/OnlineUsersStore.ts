import {flow, Instance, types, cast} from 'mobx-state-tree';

import {RequestModel, ResetModel, UserProfileModel} from 'core/models';
import {api, OnlineUsersResponse, UserSearchResponse} from 'api';

const OnlineUsersStore = types
  .compose(
    ResetModel,
    types.model('OnlineUsersStore', {
      expanded: true,
      selectedUserId: types.maybe(types.string),
      editedUserId: types.maybe(types.string),
      usersRequest: types.optional(RequestModel, {}),
      users: types.optional(types.array(UserProfileModel), []),
      searchQuery: '',
      searchUsersRequest: types.optional(RequestModel, {}),
      searchedUsers: types.optional(types.array(UserProfileModel), [])
    })
  )
  .actions((self) => ({
    toggleExpand(expanded?: boolean) {
      if (expanded !== undefined) {
        self.expanded = expanded;
      } else {
        self.expanded = !self.expanded;
      }
    },
    selectUser(userId: string) {
      self.selectedUserId = userId;
    },
    unselectUser() {
      self.selectedUserId = undefined;
    },
    editUser(userId: string) {
      self.editedUserId = userId;
    },
    endEditingUser() {
      self.editedUserId = undefined;
    },
    fetchUsers: flow(function* (worldId: string) {
      const response: OnlineUsersResponse = yield self.usersRequest.send(
        api.userRepository.fetchOnlineUsers,
        {worldId}
      );

      if (response) {
        self.users = cast(response);
      }
    }),
    searchUsers: flow(function* (worldId: string, online: boolean) {
      const response: UserSearchResponse = yield self.searchUsersRequest.send(
        api.userRepository.search,
        {
          q: self.searchQuery,
          worldId,
          online
        }
      );

      if (response) {
        self.searchedUsers = cast(response.results);
      }
    }),
    setSearchQuery(query: string) {
      self.searchQuery = query;
    }
  }));

export interface OnlineUsersStoreInterface extends Instance<typeof OnlineUsersStore> {}

export {OnlineUsersStore};
