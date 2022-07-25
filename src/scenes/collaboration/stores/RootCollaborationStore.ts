import {flow, types} from 'mobx-state-tree';

import {Space, ResetModel, RequestModel} from 'core/models';
import {UnityService} from 'shared/services';
import {PosBusEventEnum} from 'core/enums';
import {PrivateSpaceError} from 'core/errors';

import {CalendarStore} from './CalendarStore';
import {Dashboard} from './DashboardStore/models/Dashboard';

const RootCollaborationStore = types
  .compose(
    ResetModel,
    types.model('RootCollaborationStore', {
      space: types.optional(Space, {}),
      calendarStore: types.optional(CalendarStore, {}),
      dashboard: types.optional(Dashboard, {}),

      // collaboration
      leftMeetingSpaceId: types.maybe(types.string),
      leftMeetingSpaceWasAGrabbedTable: types.maybe(types.boolean),

      // requests
      joinMeetingSpaceRequest: types.optional(RequestModel, {})
    })
  )
  .volatile(() => ({
    leftMeetingTimer: setTimeout(() => {}, 0)
  }))
  .actions((self) => ({
    joinMeetingSpace: flow(function* (spaceId: string, isTable = false) {
      clearTimeout(self.leftMeetingTimer);

      if (!(yield self.space.canUserJoin(spaceId))) {
        throw new PrivateSpaceError();
      }

      self.space.setup(spaceId, isTable);
      yield self.space.fetchSpaceInformation();

      if (!isTable) {
        yield self.dashboard.fetchDashboard(spaceId);
      }

      UnityService.triggerInteractionMsg?.(PosBusEventEnum.EnteredSpace, spaceId, 0, '');
    }),
    leaveMeetingSpace() {
      self.leftMeetingSpaceId = self.space.id;
      self.leftMeetingSpaceWasAGrabbedTable = self.space.isTable;
      self.space.resetModel();

      self.leftMeetingTimer = setTimeout(() => {
        self.leftMeetingSpaceId = undefined;
      }, 15000);
    },
    rejoinMeetingSpace: flow(function* () {
      clearTimeout(self.leftMeetingTimer);

      if (!self.leftMeetingSpaceId) {
        return;
      }

      self.space.setup(self.leftMeetingSpaceId, self.leftMeetingSpaceWasAGrabbedTable);
      yield self.space.fetchSpaceInformation();

      if (self.leftMeetingSpaceWasAGrabbedTable === false) {
        yield self.dashboard.fetchDashboard(self.leftMeetingSpaceId);
      }

      self.leftMeetingSpaceId = undefined;
      self.leftMeetingSpaceWasAGrabbedTable = false;
    })
  }))
  .views((self) => ({
    get isSpaceLoaded(): boolean {
      return self.space.didFetchSpaceInformation;
    }
  }));

export {RootCollaborationStore};
