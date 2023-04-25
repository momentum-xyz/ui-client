import {cast, flow, Instance, types} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum-xyz/core';

import {World} from 'core/models/World';
import {api, WorldInterface} from 'api';

const WorldDetails = types.compose(
  ResetModel,
  types
    .model('WorldDetails', {
      id: types.string,
      world: types.maybeNull(World),
      request: types.optional(RequestModel, {})
    })
    .actions((self) => ({
      fetchWorld: flow(function* () {
        const response: WorldInterface = yield self.request.send(api.worldRepository.fetchWorld, {
          worldId: self.id
        });

        if (response) {
          self.world = cast(response);
        }
      })
    }))
    .actions((self) => ({
      afterCreate() {
        self.fetchWorld();
      }
    }))
);

export type WorldDetailsModelType = Instance<typeof WorldDetails>;

export {WorldDetails};
