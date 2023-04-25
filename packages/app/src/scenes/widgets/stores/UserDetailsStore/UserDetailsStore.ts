import {types} from 'mobx-state-tree';
import {ResetModel} from '@momentum-xyz/core';

import {UserDetails} from 'core/models';

const UserDetailsStore = types.compose(
  ResetModel,
  types
    .model('UserDetailsStore', {
      userDetails: types.maybeNull(UserDetails)
    })
    .actions((self) => ({
      init(userId: string): void {
        self.userDetails = UserDetails.create({userId});
      }
    }))
);

export {UserDetailsStore};
