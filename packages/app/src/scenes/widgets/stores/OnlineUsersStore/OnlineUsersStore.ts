import {cast, types} from 'mobx-state-tree';
import {ResetModel} from '@momentum-xyz/core';

import {ONLINE_USERS} from './_mocks';

export interface OdysseyUserInterface {
  id: string;
  name: string;
  avatar_hash: string;
  createdAt: string;
}

const OnlineUsersStore = types
  .compose(
    ResetModel,
    types.model('OnlineUsersStore', {
      onlineUsers: types.optional(types.array(types.frozen<OdysseyUserInterface>()), [])
    })
  )
  .actions((self) => ({
    init(): void {
      this.fetchOnlineUsers();
    },
    fetchOnlineUsers(): void {
      self.onlineUsers = cast(ONLINE_USERS);
    }
  }))
  .views(() => ({}));

export {OnlineUsersStore};
