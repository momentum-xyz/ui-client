import {castToSnapshot, Instance, types} from 'mobx-state-tree';
import {ResetModel} from '@momentum-xyz/core';

import {NftItem} from 'core/models';
import {World} from 'core/models/World';
import {getRootStore} from 'core/utils';

// FIXME: It should be the same like UserDetails.
// FIXME: Remove `types.reference` to avoid missing data.
const WorldDetails = types.compose(
  ResetModel,
  types
    .model('WorldDetails', {
      worldId: types.string,
      world: types.maybeNull(World),
      usersStakedIn: types.optional(types.array(types.reference(NftItem)), []),
      lastStakingComment: '',
      totalAmountStaked: 0
    })
    .actions((self) => ({
      init(): void {
        // TODO: implementation
        const {nftItems} = getRootStore(self).nftStore;
        self.usersStakedIn = castToSnapshot(nftItems.slice(30, 40));
        self.lastStakingComment = 'Lorem ipsum dolor sit amet, consecteer adipiscing elit. Aenean.';
        self.totalAmountStaked = 0;
      }
    }))
);

export type WorldDetailsModelType = Instance<typeof WorldDetails>;

export {WorldDetails};
