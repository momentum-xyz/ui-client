import {cast, flow, Instance, types} from 'mobx-state-tree';
import {RequestModel} from '@momentum-xyz/core';

import {UserProfileModel, UserProfileModelInterface} from 'core/models';
import {api, OnlineUsersResponse, UserSearchResponse} from 'api';

const OnlineUsersList = types
  .model('OnlineUsersList', {
    usersRequest: types.optional(RequestModel, {}),
    users: types.optional(types.array(UserProfileModel), []),
    searchQuery: ''
  })
  .actions((self) => ({
    fetchUsers: flow(function* (
      worldId: string,
      currentUserId: string,
      includeCurrentUser: boolean
    ) {
      const response: OnlineUsersResponse = yield self.usersRequest.send(
        api.userRepository_OLD.fetchOnlineUsers,
        {worldId}
      );

      if (response) {
        self.users = cast([
          ...response.filter((user) => includeCurrentUser && user.id === currentUserId),
          ...response.filter((user) => user.id !== currentUserId)
        ]);
      }
    }),
    searchUsers: flow(function* (
      worldId: string,
      online: boolean,
      currentUserId: string,
      includeCurrentUser: boolean
    ) {
      const response: UserSearchResponse = yield self.usersRequest.send(
        api.userRepository_OLD.search,
        {
          q: self.searchQuery,
          worldId,
          online
        }
      );

      if (response) {
        self.users = cast([
          ...response.results.filter((user) => includeCurrentUser && user.id === currentUserId),
          ...response.results.filter((user) => user.id !== currentUserId)
        ]);
      }
    }),
    setSearchQuery(query: string) {
      self.searchQuery = query;
    }
  }))
  .views((self) => ({
    get isLoading(): boolean {
      return self.usersRequest.isPending;
    },
    filteredPeople(excludedPeopleIds: string[]): UserProfileModelInterface[] {
      return self.users.filter((user) => !excludedPeopleIds?.includes(user.uuid));
    }
  }));

export interface OnlineUsersListInterface extends Instance<typeof OnlineUsersList> {}

export {OnlineUsersList};
