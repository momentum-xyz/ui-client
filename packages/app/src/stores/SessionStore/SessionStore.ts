import {cast, flow, types} from 'mobx-state-tree';
import {RequestModel} from '@momentum-xyz/core';
import {UserStatusEnum} from '@momentum-xyz/ui-kit';

import {api, FetchMeResponse} from 'api';
import {User} from 'core/models';

const SessionStore = types
  .model('SessionStore', {
    user: types.maybeNull(User),
    request: types.optional(RequestModel, {}),
    profileRequest: types.optional(RequestModel, {}),
    statusRequest: types.optional(RequestModel, {})
  })
  .actions((self) => ({
    loadUserProfile: flow(function* () {
      const response: FetchMeResponse = yield self.profileRequest.send(
        api.userRepository.fetchMe,
        {}
      );
      if (response) {
        self.user = cast(response);
      }

      return !!response?.id;
    })
  }))
  .views((self) => ({
    get isUserReady(): boolean {
      return !!self.user;
    },
    get userId(): string {
      return self.user?.id || '';
    }
  }))
  .actions((self) => ({
    changeStatus: flow(function* (status: UserStatusEnum) {
      yield self.statusRequest.send(api.statusRepository.changeStatus, {status});
    })
  }));

export {SessionStore};
