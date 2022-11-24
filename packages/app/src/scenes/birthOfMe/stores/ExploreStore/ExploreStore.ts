import {cast, types} from 'mobx-state-tree';
import {ResetModel} from '@momentum-xyz/core';

import {NftItemInterface} from '../NftStore/models';

import {ODYSSEY_FEED} from './_mocks';

export interface OdysseyFeedInterface extends NftItemInterface {
  date: string;
  type: 'created' | 'connected' | 'docked';
  connectedTo?: OdysseyFeedInterface;
  dockedTo?: string;
}

const ExploreStore = types
  .compose(
    ResetModel,
    types.model('ExploreStore', {
      items: types.optional(types.array(types.frozen<OdysseyFeedInterface>()), []),
      searchedItems: types.optional(types.array(types.frozen<NftItemInterface>()), []),

      searchQuery: types.optional(types.string, ''),

      isExpanded: types.optional(types.boolean, true)
    })
  )
  .actions((self) => ({
    init(): void {
      self.items = cast(ODYSSEY_FEED);
    }
  }))
  .views((self) => ({
    filterItems(): OdysseyFeedInterface[] {
      return [];
    }
  }));

export {ExploreStore};
