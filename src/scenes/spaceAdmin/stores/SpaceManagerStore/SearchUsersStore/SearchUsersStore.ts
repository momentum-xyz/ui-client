import {flow, types, cast} from 'mobx-state-tree';

import {RequestModel, ResetModel} from 'core/models';
import {api, UserSearchResponse} from 'api';
import {SpaceUserModel} from 'core/models';

const SearchUsersStore = types.compose(
  ResetModel,
  types
    .model('SearchUsersStore', {
      selectedUserId: types.maybe(types.string),
      showResults: false,
      results: types.optional(types.array(SpaceUserModel), []),
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
);

export {SearchUsersStore};
