import {flow, types} from 'mobx-state-tree';

import {Space, ResetModel, RequestModel} from 'core/models';
import {PrivateSpaceError} from 'core/errors';
import {api} from 'api';

import {Dashboard} from './DashboardStore/models/Dashboard';
import {CalendarStore} from './CalendarStore';
import {MiroBoardStore} from './MiroBoardStore';
import {DashboardStore} from './DashboardStore';

const RootCollaborationStore = types
  .compose(
    ResetModel,
    types.model('RootCollaborationStore', {
      space: types.maybe(Space),
      calendarStore: types.optional(CalendarStore, {}),
      dashboard: types.optional(Dashboard, {}),
      dashboardStore: types.optional(DashboardStore, {}),
      miroBoardStore: types.optional(MiroBoardStore, {}),
      isModerator: false,

      // collaboration
      leftMeetingSpaceId: types.maybe(types.string),
      leftMeetingSpaceWasAGrabbedTable: types.maybe(types.boolean),

      // requests
      joinMeetingSpaceRequest: types.optional(RequestModel, {}),
      moderationRequest: types.optional(RequestModel, {})
    })
  )
  .volatile(() => ({
    leftMeetingTimer: setTimeout(() => {}, 0)
  }))
  .actions((self) => ({
    joinMeetingSpace: flow(function* (spaceId: string, isTable = false) {
      clearTimeout(self.leftMeetingTimer);

      self.space = Space.create({id: spaceId, isTable});

      if (!(yield self.space?.canUserJoin(spaceId))) {
        throw new PrivateSpaceError();
      }

      yield self.space.fetchSpaceInformation();

      if (!isTable) {
        yield self.dashboard.fetchDashboard(spaceId);
      }

      const isModerator: boolean = yield self.moderationRequest.send(
        api.spaceIntegrationsRepository.checkSpaceModeration,
        {spaceId}
      );

      self.isModerator = isModerator;
    }),
    leaveMeetingSpace() {
      self.leftMeetingSpaceId = self.space?.id;
      self.leftMeetingSpaceWasAGrabbedTable = self.space?.isTable;
      self.space = undefined;
      self.isModerator = false;

      self.leftMeetingTimer = setTimeout(() => {
        self.leftMeetingSpaceId = undefined;
      }, 15000);
    },
    rejoinMeetingSpace: flow(function* () {
      clearTimeout(self.leftMeetingTimer);

      if (!self.leftMeetingSpaceId) {
        return;
      }

      self.space = Space.create({
        id: self.leftMeetingSpaceId,
        isTable: self.leftMeetingSpaceWasAGrabbedTable
      });
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
      return self.space?.didFetchSpaceInformation ?? false;
    }
  }));

export {RootCollaborationStore};
