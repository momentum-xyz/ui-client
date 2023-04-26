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
      init(worldId: string): void {
        self.worldDetails = WorldDetails.create({worldId});
      }
    }))
);

export {WorldDetailsStore};
