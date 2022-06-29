import {cast, flow, types} from 'mobx-state-tree';

import {RequestModel, ResetModel, TileListInterface, TileList} from 'core/models';
import {api} from 'api';

const Dashboard = types.compose(
  ResetModel,
  types
    .model('Dashboard', {
      request: types.optional(RequestModel, {}),
      tileList: types.optional(TileList, {})
    })
    .actions((self) => ({
      fetchDashboard: flow(function* fetchDashboard(spaceId: string) {
        const response: TileListInterface = yield self.request.send(
          api.dashboardRepository.fetchDashboard,
          {
            spaceId
          }
        );
        if (response) {
          self.tileList = cast(response);
        }
      })
    }))
);

export {Dashboard};
