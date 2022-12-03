import {cast, types} from 'mobx-state-tree';
import {ResetModel} from '@momentum-xyz/core';

import {SearchQuery} from 'core/models';
import {NftItemInterface} from 'scenes/birthOfMe/stores/NftStore/models';

import {ODYSSEY_FEED, ODYSSEY_LIST} from './_mocks';

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
      odysseyCount: 0,
      newsFeed: types.optional(types.array(types.frozen<OdysseyFeedInterface>()), []),
      odysseyList: types.optional(types.array(types.frozen<NftItemInterface>()), []),
      searchQuery: types.optional(SearchQuery, {})
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
    },
    // TODO: Implementation
    searchOdysseys(): void {
      self.odysseyList = cast(
        ODYSSEY_LIST.filter((i) =>
          i.name.toLocaleLowerCase().includes(self.searchQuery.query.toLowerCase())
        )
      );
    }
  }))
  .views(() => ({}));

export {ExploreStore};
