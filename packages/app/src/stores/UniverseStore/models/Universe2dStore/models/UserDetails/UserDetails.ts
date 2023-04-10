import {Instance, types} from 'mobx-state-tree';
import {ResetModel} from '@momentum-xyz/core';

import {NftItem} from 'core/models';

const UserDetails = types.compose(
  ResetModel,
  types
    .model('UserDetails', {
      user: types.reference(NftItem)
    })
    .actions((self) => ({
      afterCreate(): void {}
    }))
);

export type UserDetailsType = Instance<typeof UserDetails>;

export {UserDetails};
