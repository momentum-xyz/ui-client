import {types} from 'mobx-state-tree';
import {ResetModel, Dialog} from '@momentum-xyz/core';

import {WorldStats} from './models';

const WorldStatsStore = types.compose(
  ResetModel,
  types
    .model('WorldStatsStore', {
      statsDialog: types.optional(Dialog, {}),
      worldStats: types.optional(WorldStats, {})
    })
    .actions((self) => ({
      init(spaceId: string) {
        self.worldStats.fetchStats(spaceId);
      }
    }))
);

export {WorldStatsStore};
