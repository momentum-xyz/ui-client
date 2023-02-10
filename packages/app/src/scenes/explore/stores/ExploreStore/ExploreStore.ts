import {cast, flow, types} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum-xyz/core';

import {api, NewsfeedResponse, NewsfeedItemInterface} from 'api';

const ExploreStore = types
  .compose(
    ResetModel,
    types.model('ExploreStore', {
      newsfeed: types.optional(types.array(types.frozen<NewsfeedItemInterface>()), []),
      request: types.optional(RequestModel, {}),
      createRequest: types.optional(RequestModel, {})
    })
  )
  .actions((self) => ({
    init(): void {
      self.fetchNewsfeed();
    },
    fetchNewsfeed: flow(function* () {
      const response: NewsfeedResponse = yield self.request.send(api.newsfeedRepository.fetch, {});
      if (response) {
        self.newsfeed = cast(response.items);
      }
    })
  }))
  .actions((self) => ({
    createNewsfeedItem: flow(function* (item: NewsfeedItemInterface) {
      yield self.request.send(api.newsfeedRepository.create, {item});
      self.fetchNewsfeed();
    }),
    createMutualDocks: flow(function* (walletA: string, walletB: string) {
      console.log('create mutual-docks', walletA, walletB);
      yield self.request.send(api.userRepository.createMutualDocks, {walletA, walletB});
    }),
    destroyMutualDocks: flow(function* (walletA: string, walletB: string) {
      console.log('destroy mutual-docks', walletA, walletB);
      yield self.request.send(api.userRepository.destroyMutualDocks, {walletA, walletB});
    })
  }));

export {ExploreStore};
