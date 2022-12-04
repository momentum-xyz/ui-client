import {cast, types} from 'mobx-state-tree';
import {ResetModel} from '@momentum-xyz/core';

import {NftItemInterface} from 'stores/NftStore/models';

import {ODYSSEY_FEED} from './_mocks';

export interface OdysseyFeedInterface extends NftItemInterface {
  date: string;
  type: 'created' | 'connected' | 'docked';
  connectedTo?: OdysseyFeedInterface;
  dockedTo?: OdysseyFeedInterface;
}

export interface OdysseyItemInterface extends NftItemInterface {
  connections: number;
  docking: number;
  events: number;
}

const ExploreStore = types
  .compose(
    ResetModel,
    types.model('ExploreStore', {
      newsFeed: types.optional(types.array(types.frozen<OdysseyFeedInterface>()), [])
    })
  )
  .actions((self) => ({
    init(): void {
      this.fetchNewsFeed();
    },
    // TODO: Implementation
    fetchNewsFeed(): void {
      self.newsFeed = cast(ODYSSEY_FEED);
    }
  }))
  .views(() => ({}));

export {ExploreStore};
