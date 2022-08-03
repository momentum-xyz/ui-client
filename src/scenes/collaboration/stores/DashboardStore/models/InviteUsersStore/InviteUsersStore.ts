import {flow, Instance, types} from 'mobx-state-tree';

import {RequestModel, ResetModel} from 'core/models';
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
      console.info(spaceId);
      console.info(userId);
      yield self.usersRequest.send(api.spaceInviteRepository.inviteToSpaceOrTable, {
        spaceId,
        userId: userId,
        isTable: false
      });

      return self.usersRequest.isDone;
    })
  }));

export interface InviteUsersStoreInterface extends Instance<typeof InviteUsersStore> {}

export {InviteUsersStore};
