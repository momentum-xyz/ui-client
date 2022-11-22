import {flow, types} from 'mobx-state-tree';
import {ResetModel} from '@momentum-xyz/core';

import {StartStore} from './StartStore';
import {NftStore} from './NftStore';

const RootBirthOfMeStore = types.compose(
  ResetModel,
  types
    .model('RootBirthOfMeStore', {
      nftStore: types.optional(NftStore, {}),
      startStore: types.optional(StartStore, {})
    })
    .actions((self) => ({
      init: flow(function* () {
        yield self.nftStore.init();
      })
    }))
);
export {RootBirthOfMeStore};
