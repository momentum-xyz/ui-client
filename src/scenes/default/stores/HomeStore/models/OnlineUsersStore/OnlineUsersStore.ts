import {flow, Instance, types, cast} from 'mobx-state-tree';

import {OnlineUsersList, RequestModel, ResetModel} from 'core/models';
import {api, OnlineUsersResponse, UserSearchResponse} from 'api';

const OnlineUsersStore = types
  .compose(
    ResetModel,
    types.model('OnlineUsersStore', {
      expanded: true,
      selectedUserId: types.maybe(types.string),
      onlineUsersList: types.optional(OnlineUsersList, {}),
      editedUserId: types.maybe(types.string),
      usersRequest: types.optional(RequestModel, {}),
      searchUsersRequest: types.optional(RequestModel, {})
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
        self.onlineUsersList.users = cast(response);
      }
    }),
    searchUsers: flow(function* (worldId: string, online: boolean) {
      const response: UserSearchResponse = yield self.searchUsersRequest.send(
        api.userRepository.search,
        {
          q: self.onlineUsersList.searchQuery,
          worldId,
          online
        }
      );

      if (response) {
        self.onlineUsersList.searchedUsers = cast(response.results);
      }
    }),
    setSearchQuery(query: string) {
      self.onlineUsersList.searchQuery = query;
    }
  }));

export interface OnlineUsersStoreInterface extends Instance<typeof OnlineUsersStore> {}

export {OnlineUsersStore};
