import {castToSnapshot, Instance, types} from 'mobx-state-tree';
import {ResetModel} from '@momentum-xyz/core';

import {NftItem} from 'core/models';
import {getRootStore} from 'core/utils';

const UserDetails = types.compose(
  ResetModel,
  types
    .model('UserDetails', {
      user: types.reference(NftItem),
      nftOwned: types.optional(types.array(types.reference(NftItem)), []),
      nftStakedIn: types.optional(types.array(types.reference(NftItem)), [])
    })
    .actions((self) => ({
      init(): void {
        // TODO: implementation
        const {nftItems} = getRootStore(self).nftStore;
        self.nftOwned = castToSnapshot(nftItems.slice(20, 22));
        self.nftStakedIn = castToSnapshot(nftItems.slice(22, 24));
      }
    }))
);

export type UserDetailsType = Instance<typeof UserDetails>;

export {UserDetails};
