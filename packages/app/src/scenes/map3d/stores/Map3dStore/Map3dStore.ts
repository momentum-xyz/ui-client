import {cast, types} from 'mobx-state-tree';
import {ResetModel} from '@momentum-xyz/core';

import {NftItem, NftItemInterface} from 'stores/NftStore/models';
import {OdysseyItemInterface} from 'scenes/explore/stores';

const Map3dStore = types
  .compose(
    ResetModel,
    types.model('Map3dStore', {
      selectedNft: types.maybeNull(types.reference(NftItem))
    })
  )
  .actions((self) => ({
    selectOdyssey(item: NftItemInterface): void {
      self.selectedNft = cast(item);
    },
    unselectOdyssey(): void {
      self.selectedNft = null;
    }
  }))
  .views((self) => ({
    get selectedOdyssey(): OdysseyItemInterface | null {
      if (!self.selectedNft) {
        return null;
      }

      return {
        ...self.selectedNft,
        connections: 0,
        docking: 0,
        events: 0
      };
    }
  }));

export {Map3dStore};
