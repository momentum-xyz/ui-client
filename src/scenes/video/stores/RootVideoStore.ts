import {flow, Instance, types} from 'mobx-state-tree';

import {ResetModel} from 'core/models';

const RootVideoStore = types
  .compose(
    ResetModel,
    types.model('RootVideoStore', {
      type: types.maybe(types.string),
      dashboardId: types.maybe(types.string)
    })
  )
  .actions((self) => ({
    handleClickEventVideo(id: string) {
      self.dashboardId = id;
      self.type = 'DASHBOARD_VIDEO';
    },
    close: flow(function* (
      onJoin: (dashboardId: string) => Promise<void>,
      pauseUnity: () => void,
      onNavigation: () => void,
      shouldOpenDashboard = false
    ) {
      self.type = undefined;

      if (shouldOpenDashboard) {
        if (self.dashboardId) {
          yield onJoin(self.dashboardId);
          pauseUnity();
          onNavigation();
        }
      }

      self.dashboardId = undefined;
    })
  }));

export interface RootVideoStoreInterface extends Instance<typeof RootVideoStore> {}

export {RootVideoStore};
