import {flow, types, cast} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum-xyz/core';

import {
  api,
  WorldConfigType,
  WorldConfigResponse,
  SpaceAttributeItemResponse,
  SpaceInterface
} from 'api';
import {mapper} from 'api/mapper';
import {Space} from 'core/models';
import {getRootStore} from 'core/utils';

// TODO: Use this store a little bit more :)
// It is a main store for current world
const WorldStore = types.compose(
  ResetModel,
  types
    .model('WorldStore', {
      worldId: types.optional(types.string, ''),
      world: types.maybeNull(Space),
      worldConfigRequest: types.optional(RequestModel, {}),
      worldInformationRequest: types.optional(RequestModel, {}),
      worldConfig: types.maybe(types.frozen<WorldConfigType>())
    })
    .actions((self) => ({
      init(worldId: string) {
        self.worldId = worldId;
        //self.fetchWorldConfig(worldId);
        this.fetchWorldInformation(worldId);
      },
      fetchWorldConfig: flow(function* (worldId: string) {
        const response: WorldConfigResponse = yield self.worldConfigRequest.send(
          api.spaceRepositoryOld.fetchWorldConfig,
          {worldId}
        );

        if (response) {
          self.worldConfig = cast(response);
        }
      }),
      fetchWorldInformation: flow(function* (spaceId: string) {
        const response: SpaceAttributeItemResponse = yield self.worldInformationRequest.send(
          api.spaceRepository.fetchSpace,
          {spaceId}
        );

        if (response) {
          self.world = cast({
            id: spaceId,
            ...mapper.mapSpaceSubAttributes<SpaceInterface>(response)
          });
        }
      })
    }))
    .views((self) => ({
      get isMyWorld(): boolean {
        return self.worldId === getRootStore(self).sessionStore.userId;
      }
    }))
);

export {WorldStore};
