import {flow, Instance, types} from 'mobx-state-tree';
import {RequestModel} from '@momentum/core';
import {ResetModel} from '@momentum/sdk';

import {api} from 'api';

const InviteUsersStore = types
  .compose(
    ResetModel,
    types.model('InviteUsersStore', {
      usersRequest: types.optional(RequestModel, {})
    })
  )
  .actions((self) => ({
    invite: flow(function* (spaceId: string, userId: string) {
      yield self.usersRequest.send(api.spaceInviteRepository.inviteToSpaceOrTable, {
        spaceId,
        userId: userId,
        isTable: false
      });

      return self.usersRequest.isDone;
    })
  }));

export type InviteUsersStoreType = Instance<typeof InviteUsersStore>;

export {InviteUsersStore};
