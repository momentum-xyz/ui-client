import {Instance, types} from 'mobx-state-tree';
import {ResetModel} from '@momentum-xyz/core';

import {NftItem} from 'core/models';

const WorldDetails = types.compose(
  ResetModel,
  types
    .model('WorldDetails', {
      world: NftItem // FIXME: world: types.reference
    })
    .actions((self) => ({
      afterCreate(): void {}
    }))
);

export type WorldDetailsType = Instance<typeof WorldDetails>;

export {WorldDetails};
