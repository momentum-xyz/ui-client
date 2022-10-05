import {flow, types, cast} from 'mobx-state-tree';
import {RequestModel} from '@momentum/core';
import {ResetModel} from '@momentum/sdk';

import {api, UserSearchResponse} from 'api';
import {SpaceUserModel, UserModel} from 'core/models';
import {bytesToUuid} from 'core/utils';

const SearchUsersStore = types.compose(
  ResetModel,
  types
    .model('SearchUsersStore', {
      selectedUserId: types.maybe(types.string),
      showResults: false,
      results: types.optional(types.array(SpaceUserModel), []),
      userSearchResults: types.optional(types.array(UserModel), []),
      searchRequest: types.optional(RequestModel, {})
    })
    .actions((self) => ({
      search: flow(function* (query: string, worldId: string) {
        const response: UserSearchResponse = yield self.searchRequest.send(
          api.userRepository.search,
          {
            q: query,
            worldId
          }
        );

        if (response) {
          self.results = cast(response.results);
          self.showResults = response.results.length > 0;
        }
      }),
      hideResults() {
        self.showResults = false;
      },
      selectUser(id?: string) {
        self.selectedUserId = id;
        self.showResults = false;
      }
    }))
    .views((self) => ({
      get resultsList() {
        return self.results.map((user) => ({
          id: bytesToUuid(user.id.data),
          name: user.name
        }));
      }
    }))
);

export {SearchUsersStore};
