import {RequestModel} from '@momentum-xyz/core';
import {flow, Instance, types} from 'mobx-state-tree';

import {api, FetchUserResponse} from 'api';
import {getImageAbsoluteUrl} from 'core/utils';

const VoiceChatUser = types
  .model('VoiceChatUser', {
    id: types.string,
    name: types.maybe(types.string),
    avatarHash: types.maybe(types.string),
    request: types.optional(RequestModel, {})
  })
  .actions((self) => ({
    afterCreate() {
      this.fetchUser();
    },
    fetchUser: flow(function* () {
      const user: FetchUserResponse = yield self.request.send(api.userRepository.fetchUser, {
        userId: self.id
      });

      self.name = user.name;
      self.avatarHash = user.profile.avatarHash;
    })
  }))
  .views((self) => ({
    get avatarSrc(): string | null {
      return getImageAbsoluteUrl(self.avatarHash);
    }
  }));

export interface VoiceChatUserModelInterface extends Instance<typeof VoiceChatUser> {}

export {VoiceChatUser};
