import {types} from 'mobx-state-tree';

import {DialogModel, ResetModel} from 'core/models';

import {WorldStats} from './models';

const WorldStatsStore = types.compose(
  ResetModel,
  types
    .model('WorldStatsStore', {
      statsDialog: types.optional(DialogModel, {}),
      worldStats: types.optional(WorldStats, {})
    })
    .actions((self) => ({
      init(spaceId: string) {
        self.worldStats.fetchStats(spaceId);
      }
    }))
);

export {WorldStatsStore};
