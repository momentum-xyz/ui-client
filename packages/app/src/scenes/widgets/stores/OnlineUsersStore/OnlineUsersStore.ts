import {cast, flow, types} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum-xyz/core';

import {User} from 'core/models';
import {api, OdysseyOnlineUsersResponse} from 'api';

const OnlineUsersStore = types
  .compose(
    ResetModel,
    types.model('OnlineUsersStore', {
      odysseyUsers: types.optional(types.array(User), []),
      request: types.optional(RequestModel, {})
    })
  )
  .actions((self) => ({
    init(worldId: string, userId: string): void {
      this.fetchOdysseyUsers(worldId, userId);
    },
    fetchOdysseyUsers: flow(function* (worldId: string, currentUserId: string) {
      const response: OdysseyOnlineUsersResponse = yield self.request.send(
        api.worldRepository.fetchOnlineUsers,
        {worldId}
      );

      if (response) {
        self.odysseyUsers = cast([...response.filter((user) => user.id !== currentUserId)]);
      }
    })
  }));

export {OnlineUsersStore};
