import {flow, types} from 'mobx-state-tree';

import {RequestModel, ResetModel} from 'core/models';
import {api, DashboardResponseInterface} from 'api';

const DashboardStore = types.compose(
  ResetModel,
  types
    .model('DashboardStore', {
      request: types.optional(RequestModel, {})
    })
    .actions((self) => ({
      fetchDashboard: flow(function* fetchDashboard(spaceId: string) {
        const response: DashboardResponseInterface = yield self.request.send(
          api.dashboardRepository.fetchDashboard,
          {
            spaceId
          }
        );
        if (response) {
          console.info('The response is: ', response);
        }
      })
    }))
);

export {DashboardStore};
