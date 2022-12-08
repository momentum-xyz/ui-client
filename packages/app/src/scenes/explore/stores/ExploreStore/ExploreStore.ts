import {cast, flow, types} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum-xyz/core';

import {NftItemInterface} from 'stores/NftStore/models';
import {api, NewsFeedResponse, NftFeedItemInterface} from 'api';

export interface OdysseyItemInterface extends NftItemInterface {
  connections: number;
  docking: number;
  events: number;
}

const ExploreStore = types
  .compose(
    ResetModel,
    types.model('ExploreStore', {
      nftFeed: types.optional(types.array(types.frozen<NftFeedItemInterface>()), []),
      request: types.optional(RequestModel, {}),
      createRequest: types.optional(RequestModel, {})
    })
  )
  .actions((self) => ({
    init(): void {
      self.fetchNewsFeed();
    },
    fetchNewsFeed: flow(function* () {
      const response: NewsFeedResponse = yield self.request.send(api.feedRepository.fetchFeed, {});
      if (response) {
        self.nftFeed = cast(response.items);
      }
    })
  }))
  .actions((self) => ({
    createNewsFeedItem: flow(function* (item: NftFeedItemInterface) {
      yield self.request.send(api.feedRepository.createFeedItem, {item});
      self.fetchNewsFeed();
    })
  }));

export {ExploreStore};
