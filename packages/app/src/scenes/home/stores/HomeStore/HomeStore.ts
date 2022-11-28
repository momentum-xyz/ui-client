import {flow, types} from 'mobx-state-tree';
import {Dialog, RequestModel, ResetModel} from '@momentum-xyz/core';

import {api} from 'api';

import {ExploreStore, OnlineUsersStore, UserProfileStore} from './models';

const HomeStore = types.compose(
  ResetModel,
  types
    .model('HomeStore', {
      onlineUsersStore: types.optional(OnlineUsersStore, {}),
      exploreStore: types.optional(ExploreStore, {}),
      userProfileStore: types.optional(UserProfileStore, {}),
      userProfileDialog: types.optional(Dialog, {}),

      // TODO: Movement after getting design
      startRequest: types.optional(RequestModel, {}),
      stopRequest: types.optional(RequestModel, {})
    })
    // TODO: Movement after getting design
    .actions((self) => ({
      start: flow(function* (spaceId: string) {
        yield self.startRequest.send(api.flyWithMeRepository.start, {spaceId});
      }),
      stop: flow(function* (spaceId: string) {
        yield self.stopRequest.send(api.flyWithMeRepository.stop, {spaceId});
      })
    }))
);

export {HomeStore};
