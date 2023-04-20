import {cast, flow, Instance, types} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum-xyz/core';

import {api, UserWorldInfoInterface} from 'api';
import {UserInfo} from 'core/models/UserInfo';
import {WorldInfo} from 'core/models/WorldInfo';

const UserDetails = types.compose(
  ResetModel,
  types
    .model('UserDetails', {
      user: types.reference(UserInfo),
      worldsOwned: types.optional(types.array(types.reference(WorldInfo)), []),
      worldsStakedIn: types.optional(types.array(types.reference(WorldInfo)), []),

      worldsOwnedRequest: types.optional(RequestModel, {}),
      worldsStakedInRequest: types.optional(RequestModel, {})
    })
    .actions((self) => ({
      init(): void {
        this.loadOwnedWorlds();
        //this.loadStakedInWorlds();
      },
      loadOwnedWorlds: flow(function* () {
        const worlds: UserWorldInfoInterface[] = yield self.worldsOwnedRequest.send(
          api.userRepository.fetchWorldList,
          {userId: self.user.id}
        );
        if (worlds) {
          self.worldsOwned = cast(worlds.map((world) => world.id));
        }
      }),
      loadStakedInWorlds: flow(function* () {
        const worlds: UserWorldInfoInterface[] = yield self.worldsOwnedRequest.send(
          // FIXME: Just use correct EP which is not ready on BE side
          api.userRepository.fetchWorldList,
          {userId: self.user.id}
        );
        if (worlds) {
          self.worldsStakedIn = cast(worlds.map((world) => world.id));
        }
      })
    }))
);

export type UserDetailsModelType = Instance<typeof UserDetails>;

export {UserDetails};
