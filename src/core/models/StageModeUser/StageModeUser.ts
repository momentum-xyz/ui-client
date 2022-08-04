import {flow, Instance, types} from 'mobx-state-tree';

import {ParticipantRole} from 'core/enums';
import {api, ProfileResponse, UserProfileInterface} from 'api';
import {RequestModel} from 'core/models';
import {appVariables} from 'api/constants';

const StageModeUser = types
  .model('StageModeUser', {
    uid: types.string,
    role: types.enumeration(Object.values(ParticipantRole)),
    name: types.maybe(types.string),
    profile: types.maybe(types.frozen<UserProfileInterface>()),
    request: types.optional(RequestModel, {})
  })
  .actions((self) => ({
    fetchUser: flow(function* () {
      const userId = self.uid;
      const response: ProfileResponse = yield self.request.send(api.userRepository.fetchProfile, {
        userId
      });

      self.profile = response.profile;
      self.name = response.name;
    })
  }))
  .views((self) => ({
    get avatarSrc(): string | undefined {
      return (
        self.profile?.avatarHash &&
        `${appVariables.RENDER_SERVICE_URL}/get/${self.profile.avatarHash}`
      );
    }
  }));

export interface StageModeUserInterface extends Instance<typeof StageModeUser> {}

export {StageModeUser};
