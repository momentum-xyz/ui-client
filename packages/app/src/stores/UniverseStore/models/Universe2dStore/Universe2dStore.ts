import {types} from 'mobx-state-tree';
import {ResetModel} from '@momentum-xyz/core';

import {NftItemModelInterface} from 'core/models';
import {getRootStore} from 'core/utils';

const Universe2dStore = types.compose(
  ResetModel,
  types
    .model('Universe2dStore', {
      // allUsers: types.optional(types.array(types.frozen<NftItemModelInterface>()), []),
      // allWorlds: types.optional(types.array(types.frozen<NftItemModelInterface>()), [])
    })
    .actions((self) => ({
      init(): void {
        // TODO: implementation
      },
      getMostFeaturedWorlds(): NftItemModelInterface[] {
        return getRootStore(self).nftStore.nftItems.slice(0, 5);
      },
      getLastCreatedWorlds(): NftItemModelInterface[] {
        return getRootStore(self).nftStore.nftItems.slice(5, 10);
      },
      getLastUpdatedWorlds(): NftItemModelInterface[] {
        return getRootStore(self).nftStore.nftItems.slice(10, 15);
      },
      getMostStatedInWorlds(): NftItemModelInterface[] {
        return getRootStore(self).nftStore.nftItems.slice(15, 20);
      }
    }))
    .views((self) => ({
      get allWorlds(): NftItemModelInterface[] {
        // FIXME source and type
        return getRootStore(self).nftStore.nftItems;
      },
      get allUsers(): NftItemModelInterface[] {
        // FIXME source and type
        return getRootStore(self).nftStore.nftItems;
      }
    }))
);

export {Universe2dStore};
