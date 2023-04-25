import {cast, flow, Instance, types} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum-xyz/core';

import {api, UserInterface, WorldInfoInterface} from 'api';
import {User} from 'core/models/User';
import {WorldInfo} from 'core/models/WorldInfo';

const UserDetails = types.compose(
  ResetModel,
  types
    .model('UserDetails', {
      userId: types.string,
      user: types.maybeNull(User),
      worldsOwned: types.optional(types.array(WorldInfo), []),
      worldsStakedIn: types.optional(types.array(WorldInfo), []),
      userRequest: types.optional(RequestModel, {}),
      worldsOwnedRequest: types.optional(RequestModel, {}),
      worldsStakedInRequest: types.optional(RequestModel, {})
    })
    .actions((self) => ({
      init(): void {
        this.loadUser();
        this.loadOwnedWorlds();
      },
      initStakeData(): void {
        //this.loadStakedInWorlds();
      },
      loadUser: flow(function* () {
        const response: UserInterface = yield self.userRequest.send(api.userRepository.fetchUser, {
          userId: self.userId
        });

        if (response) {
          self.user = cast(response);
        }
      }),
      loadOwnedWorlds: flow(function* () {
        const worlds: WorldInfoInterface[] = yield self.worldsOwnedRequest.send(
          api.userRepository.fetchWorldList,
          {userId: self.userId}
        );
        if (worlds) {
          self.worldsOwned = cast(worlds);
        }
      }),
      loadStakedInWorlds: flow(function* () {
        const worlds: WorldInfoInterface[] = yield self.worldsOwnedRequest.send(
          // FIXME: Just use correct EP which is not ready on BE side
          api.userRepository.fetchWorldList,
          {userId: self.userId}
        );
        if (worlds) {
          self.worldsStakedIn = cast(worlds);
        }
      })
    }))
);

export type UserDetailsModelType = Instance<typeof UserDetails>;

export {UserDetails};
