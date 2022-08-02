import {flow, Instance, types, cast} from 'mobx-state-tree';

import {OnlineUsersList, RequestModel, ResetModel} from 'core/models';
import {api, OnlineUsersResponse, UserSearchResponse} from 'api';

const InviteUsersStore = types
  .compose(
    ResetModel,
    types.model('InviteUsersStore', {
      onlineUsersList: types.optional(OnlineUsersList, {}),
      usersRequest: types.optional(RequestModel, {}),
      searchUsersRequest: types.optional(RequestModel, {})
    })
  )
  .actions((self) => ({
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

export interface InviteUsersStoreInterface extends Instance<typeof InviteUsersStore> {}

export {InviteUsersStore};
