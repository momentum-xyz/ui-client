import {castToSnapshot, Instance, types} from 'mobx-state-tree';
import {ResetModel} from '@momentum-xyz/core';

import {NftItem} from 'core/models';
import {getRootStore} from 'core/utils';

const WorldDetails = types.compose(
  ResetModel,
  types
    .model('WorldDetails', {
      world: types.reference(NftItem),
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
        self.totalAmountStaked = 10.23012;
      }
    }))
);

export type WorldDetailsType = Instance<typeof WorldDetails>;

export {WorldDetails};
