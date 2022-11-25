import {cast, types} from 'mobx-state-tree';
import {ResetModel} from '@momentum-xyz/core';

import {NftItemInterface} from '../NftStore/models';

import {ODYSSEY_FEED} from './_mocks';

export interface OdysseyFeedInterface extends NftItemInterface {
  date: string;
  type: 'created' | 'connected' | 'docked';
  connectedTo?: OdysseyFeedInterface;
  dockedTo?: OdysseyFeedInterface;
}

const ExploreStore = types
  .compose(
    ResetModel,
    types.model('ExploreStore', {
      odysseyCount: 0,
      newsFeed: types.optional(types.array(types.frozen<OdysseyFeedInterface>()), []),
      searchedItems: types.optional(types.array(types.frozen<NftItemInterface>()), []),

      searchQuery: types.optional(types.string, '')
    })
  )
  .actions((self) => ({
    init(): void {
      this.fetchNewsFeed();
      this.fetchOdysseyCount();
    },
    // TODO: Implementation
    fetchNewsFeed(): void {
      self.newsFeed = cast(ODYSSEY_FEED);
    },
    // TODO: Implementation
    fetchOdysseyCount(): void {
      self.odysseyCount = 13095;
    }
  }))
  .views((self) => ({
    filterItems(): OdysseyFeedInterface[] {
      return [];
    }
  }));

export {ExploreStore};
