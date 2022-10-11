import {flow, types, cast} from 'mobx-state-tree';
import {RequestModel} from '@momentum/core';

import {api, WorldStatInterface} from 'api';

const WorldStats = types
  .model('WorldStats', {
    request: types.optional(RequestModel, {}),
    statistics: types.optional(types.array(types.frozen<WorldStatInterface>()), [])
  })
  .actions((self) => ({
    fetchStats: flow(function* (spaceId: string) {
      const response = yield self.request.send(api.statsRepository.fetchWorldStats, {spaceId});
      if (response) {
        self.statistics = cast(response);
      }
    })
  }))
  .views((self) => ({
    get isLoading(): boolean {
      return self.request.isPending;
    }
  }));
export {WorldStats};
