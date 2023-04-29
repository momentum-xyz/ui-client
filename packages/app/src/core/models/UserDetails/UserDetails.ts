import {cast, flow, Instance, types} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum-xyz/core';

import {User} from 'core/models/User';
import {WorldInfo} from 'core/models/WorldInfo';
import {api, UserInterface, WorldInfoInterface} from 'api';

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
          api.userRepository.fetchOwnedWorldList,
          {userId: self.userId}
        );
        if (worlds) {
          self.worldsOwned = cast(worlds);
        }
      }),
      loadStakedInWorlds: flow(function* () {
        const worlds: WorldInfoInterface[] = yield self.worldsOwnedRequest.send(
          api.userRepository.fetchStakedWorldList,
          {userId: self.userId}
        );
        if (worlds) {
          self.worldsStakedIn = cast(worlds);
        }
      })
    }))
    .actions((self) => ({
      async afterCreate() {
        await self.loadUser();
        await self.loadOwnedWorlds();
        await self.loadStakedInWorlds();
      }
    }))
);

export type UserDetailsModelType = Instance<typeof UserDetails>;

export {UserDetails};
