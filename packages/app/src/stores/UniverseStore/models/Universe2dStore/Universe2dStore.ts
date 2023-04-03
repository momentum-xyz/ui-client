import {types} from 'mobx-state-tree';
import {ResetModel} from '@momentum-xyz/core';

import {NftItemModelInterface} from 'core/models';
import {getRootStore} from 'core/utils';

const Universe2dStore = types.compose(
  ResetModel,
  types
    .model('Universe2dStore', {
      // allWorlds: types.optional(types.array, []);
      // allUsers: types.optional(types.array, []);
    })
    .actions((self) => ({
      init(): void {}
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
