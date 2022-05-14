import {Instance, types} from 'mobx-state-tree';

import {ResetModel} from 'core/models';

const WorldStore = types.compose(
  ResetModel,
  types
    .model('WorldStore', {
      worldId: types.optional(types.string, '')
    })
    .actions((self) => ({
      init(worldId: string) {
        self.worldId = worldId;
      }
    }))
);

export interface WorldStoreInterface extends Instance<typeof WorldStore> {}

export {WorldStore};
