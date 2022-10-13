import {flow, Instance, types} from 'mobx-state-tree';
import {RequestModel} from '@momentum-xyz/core';
import {ImageSizeEnum} from '@momentum-xyz/ui-kit';

import {ParticipantRoleEnum} from 'core/enums';
import {api, ProfileResponse, UserProfileInterface} from 'api';
import {appVariables} from 'api/constants';

const StageModeUser = types
  .model('StageModeUser', {
    uid: types.string,
    role: types.enumeration(Object.values(ParticipantRoleEnum)),
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
        `${appVariables.RENDER_SERVICE_URL}/texture/${ImageSizeEnum.S3}/${self.profile.avatarHash}`
      );
    }
  }));

export interface StageModeUserInterface extends Instance<typeof StageModeUser> {}

export {StageModeUser};
