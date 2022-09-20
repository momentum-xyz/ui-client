import {cast, flow, Instance, types} from 'mobx-state-tree';

import {RequestModel, UserProfileModel, UserProfileModelInterface} from 'core/models';
import {api, OnlineUsersResponse, UserSearchResponse} from 'api';
import {bytesToUuid} from 'core/utils';

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
        api.userRepository.fetchOnlineUsers,
        {worldId}
      );

      if (response) {
        self.users = cast([
          ...response.filter(
            (user) => includeCurrentUser && bytesToUuid(user.id.data) === currentUserId
          ),
          ...response.filter((user) => bytesToUuid(user.id.data) !== currentUserId)
        ]);
      }
    }),
    searchUsers: flow(function* (
      worldId: string,
      online: boolean,
      currentUserId: string,
      includeCurrentUser: boolean
    ) {
      const response: UserSearchResponse = yield self.usersRequest.send(api.userRepository.search, {
        q: self.searchQuery,
        worldId,
        online
      });

      if (response) {
        self.users = cast([
          ...response.results.filter(
            (user) => includeCurrentUser && bytesToUuid(user.id.data) === currentUserId
          ),
          ...response.results.filter((user) => bytesToUuid(user.id.data) !== currentUserId)
        ]);
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
      return self.users.filter((user) => !excludedPeopleIds?.includes(user.uuid));
    }
  }));

export interface OnlineUsersListInterface extends Instance<typeof OnlineUsersList> {}

export {OnlineUsersList};
