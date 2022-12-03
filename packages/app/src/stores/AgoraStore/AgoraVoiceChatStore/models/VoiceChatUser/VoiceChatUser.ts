import {RequestModel} from '@momentum-xyz/core';
import {flow, types} from 'mobx-state-tree';
import {ImageSizeEnum} from '@momentum-xyz/ui-kit';

import {api, FetchUserResponse} from 'api';
import {appVariables} from 'api/constants';

const VoiceChatUser = types
  .model('VoiceChatUser', {
    id: types.string,
    name: types.maybe(types.string),
    avatarHash: types.maybe(types.string),

    fetchUserRequest: types.optional(RequestModel, {})
  })
  .actions((self) => ({
    fetchUser: flow(function* () {
      const user: FetchUserResponse = yield self.fetchUserRequest.send(
        api.userRepository.fetchUser,
        {userId: self.id}
      );

      self.name = user.name;
      self.avatarHash = user.profile.avatarHash;
    })
  }))
  .views((self) => ({
    get avatarSrc(): string | undefined {
      return (
        self.avatarHash &&
        `${appVariables.RENDER_SERVICE_URL}/texture/${ImageSizeEnum.S3}/${self.avatarHash}`
      );
    }
  }));

export {VoiceChatUser};
