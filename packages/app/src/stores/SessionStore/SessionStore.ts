import {cast, flow, types} from 'mobx-state-tree';
import {RequestModel} from '@momentum-xyz/core';
import {UserStatusEnum} from '@momentum-xyz/ui-kit';

import {storage} from 'shared/services';
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
    get isGuest(): boolean {
      return !!self.user && !!self.user.wallet;
    },
    get userId(): string {
      return self.user?.id || '';
    }
  }))

  // TODO: OLD. Removal
  .actions((self) => ({
    async init(idToken: string) {
      await this.checkUserProfile(idToken);
      await self.loadUserProfile();
    },
    checkUserProfile: flow(function* (idToken: string) {
      yield self.request.send(api.userRepository.check, {idToken});
    }),
    changeStatus: flow(function* (status: UserStatusEnum) {
      yield self.statusRequest.send(api.statusRepository.changeStatus, {status});
    })
  }))
  // TODO: OLD. Removal
  .views((self) => ({
    get isSessionExists(): boolean {
      return !!storage.getByPrefix('oidc.user');
    }
  }));

export {SessionStore};
