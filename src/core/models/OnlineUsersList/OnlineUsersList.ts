import {cast, flow, Instance, types} from 'mobx-state-tree';

import {RequestModel, UserProfileModel, UserProfileModelInterface} from 'core/models';
import {api, OnlineUsersResponse, UserSearchResponse} from 'api';

const OnlineUsersList = types
  .model('OnlineUsersList', {
    usersRequest: types.optional(RequestModel, {}),
    users: types.optional(types.array(UserProfileModel), []),
    searchQuery: '',
    searchedUsers: types.optional(types.array(UserProfileModel), [])
  })
  .actions((self) => ({
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
      const response: UserSearchResponse = yield self.usersRequest.send(api.userRepository.search, {
        q: self.searchQuery,
        worldId,
        online
      });

      if (response) {
        self.searchedUsers = cast(response.results);
      }
    }),
    setSearchQuery(query: string) {
      self.searchQuery = query;
    }
  }))
  .views((self) => ({
    get isLoading(): boolean {
      return self.usersRequest.isLoading;
    },
    filteredPeople(excludedPeopleIds: string[]): UserProfileModelInterface[] {
      const users = self.searchQuery ? self.searchedUsers : self.users;
      return users.filter((user) => !excludedPeopleIds?.includes(user.uuid));
    }
  }));

export interface OnlineUsersListInterface extends Instance<typeof OnlineUsersList> {}

export {OnlineUsersList};
