import {types} from 'mobx-state-tree';
import {ResetModel} from '@momentum-xyz/core';

import {NftItemInterface} from '../NftStore/models';

export interface WorldInfoInterface extends NftItemInterface {}

//TODO:  REFACTOR
const StartStore = types
  .compose(
    ResetModel,
    types.model('StartStore', {
      selectedItemId: types.maybe(types.string),

      searchQuery: types.optional(types.string, ''),

      isExpanded: types.optional(types.boolean, true)
    })
  )
  .actions((self) => ({
    saveSelectedItem() {
      // TODO
      return Promise.resolve();
    },
    setSearchQuery(search: string) {
      self.searchQuery = search;
    },
    setIsExpanded(isExpanded: boolean) {
      self.isExpanded = isExpanded;
    }
  }))
  .views((self) => ({
    // get selectedItem(): WorldBuilderSkyboxInterface | undefined {
    //   return self.items.find((item) => item.id === self.selectedItemId);
    // }
    filterItems(items: WorldInfoInterface[]): WorldInfoInterface[] {
      return items.filter((item) =>
        item.name.toLowerCase().includes(self.searchQuery.toLowerCase())
      );
    },
    get isQueryValid(): boolean {
      return self.searchQuery.length > 0;
    }
  }));

export {StartStore};
