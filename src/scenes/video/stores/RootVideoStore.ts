import {types} from 'mobx-state-tree';

import {ResetModel} from 'core/models';
import {VideoTypeEnum} from 'core/enums';

const RootVideoStore = types
  .compose(
    ResetModel,
    types.model('RootVideoStore', {
      type: types.maybe(types.enumeration(Object.values(VideoTypeEnum))),
      dashboardId: types.maybe(types.string)
    })
  )
  .actions((self) => ({
    handleClickEventVideo(id: string) {
      self.dashboardId = id;
      self.type = VideoTypeEnum.DASHBOARD_VIDEO;
    },
    setType(type?: VideoTypeEnum): void {
      self.type = type;
    },
    setDashboardId(id?: string): void {
      self.dashboardId = id;
    }
  }));

export {RootVideoStore};
