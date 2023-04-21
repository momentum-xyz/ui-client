import {types} from 'mobx-state-tree';
import {ResetModel} from '@momentum-xyz/core';

import {WorldDetails} from 'core/models';

const WorldDetailsStore = types.compose(
  ResetModel,
  types
    .model('WorldDetailsStore', {
      worldDetails: types.maybeNull(WorldDetails)
    })
    .actions((self) => ({
      // FIXME: It should be only worldId (like UserDetails model)
      init(worldId: string): void {
        self.worldDetails = WorldDetails.create({worldId: worldId});
        self.worldDetails.init();
      }
    }))
);

export {WorldDetailsStore};
