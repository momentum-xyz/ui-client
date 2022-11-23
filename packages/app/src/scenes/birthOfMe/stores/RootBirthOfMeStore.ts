import {flow, types} from 'mobx-state-tree';
import {ResetModel} from '@momentum-xyz/core';

import {StartStore} from './StartStore';
import {NftStore} from './NftStore';
import {SignInStore} from './SignInStore';

const RootBirthOfMeStore = types.compose(
  ResetModel,
  types
    .model('RootBirthOfMeStore', {
      nftStore: types.optional(NftStore, {}),
      signInStore: types.optional(SignInStore, {}),
      startStore: types.optional(StartStore, {})
    })
    .actions((self) => ({
      init: flow(function* () {
        yield self.nftStore.init();
      })
    }))
);
export {RootBirthOfMeStore};
