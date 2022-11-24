import {flow, types} from 'mobx-state-tree';
import {ResetModel} from '@momentum-xyz/core';

import {NftStore} from './NftStore';
import {SignInStore} from './SignInStore';
import {ExploreStore} from './ExploreStore';

const RootBirthOfMeStore = types.compose(
  ResetModel,
  types
    .model('RootBirthOfMeStore', {
      nftStore: types.optional(NftStore, {}),
      signInStore: types.optional(SignInStore, {}),
      exploreStore: types.optional(ExploreStore, {})
    })
    .actions((self) => ({
      init: flow(function* () {
        yield self.nftStore.init();
      })
    }))
);
export {RootBirthOfMeStore};
