import {flow, Instance, types, cast} from 'mobx-state-tree';

import {RequestModel, ResetModel} from 'core/models';
import {api, WorldConfig, WorldConfigResponse} from 'api';

const WorldStore = types.compose(
  ResetModel,
  types
    .model('WorldStore', {
      worldId: types.optional(types.string, ''),
      worldConfigRequest: types.optional(RequestModel, {}),
      worldConfig: types.maybe(types.frozen<WorldConfig>())
    })
    .actions((self) => ({
      fetchWorldConfig: flow(function* (worldId: string) {
        const response: WorldConfigResponse = yield self.worldConfigRequest.send(
          api.spaceRepository.fetchWorldConfig,
          {worldId}
        );

        if (response) {
          self.worldConfig = cast(response);
        }
      })
    }))
    .actions((self) => ({
      init(worldId: string) {
        self.worldId = worldId;
        self.fetchWorldConfig(worldId);
      }
    }))
);

export interface WorldStoreInterface extends Instance<typeof WorldStore> {}

export {WorldStore};
