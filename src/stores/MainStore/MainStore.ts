import {types} from 'mobx-state-tree';

import {ResetModel} from 'core/models';

import {ThemeStore, SentryStore, UnityStore, WorldStore, FavoriteStore} from './models';

const MainStore = types.compose(
  ResetModel,
  types
    .model('MainStore', {
      // stores
      themeStore: types.optional(ThemeStore, {}),
      sentryStore: types.optional(SentryStore, {}),
      unityStore: types.optional(UnityStore, {}),
      worldStore: types.optional(WorldStore, {}),
      favoriteStore: types.optional(FavoriteStore, {}),

      // collaboration
      meetingSpaceId: types.maybe(types.string),
      isGrabbedTable: types.maybe(types.boolean),
      leftMeetingSpaceId: types.maybe(types.string),
      leftMeetingSpaceWasAGrabbedTable: types.maybe(types.boolean)
    })
    .volatile(() => ({
      leftMeetingTimer: new NodeJS.Timeout()
    }))
    .actions((self) => ({
      init(): void {
        self.sentryStore.init();
        self.unityStore.init();
      },
      joinMeeting(spaceId: string, isTable = false) {
        clearTimeout(self.leftMeetingTimer);

        self.meetingSpaceId = spaceId;
        self.isGrabbedTable = isTable;
      },
      leaveMeeting() {
        self.leftMeetingSpaceId = self.meetingSpaceId;
        self.leftMeetingSpaceWasAGrabbedTable = self.isGrabbedTable;
        self.meetingSpaceId = undefined;
        self.isGrabbedTable = false;

        self.leftMeetingTimer = setTimeout(() => {
          self.leftMeetingSpaceId = undefined;
        }, 15000);
      },
      rejoinMeeting() {
        clearTimeout(self.leftMeetingTimer);

        self.meetingSpaceId = self.leftMeetingSpaceId;
        self.isGrabbedTable = self.leftMeetingSpaceWasAGrabbedTable;
        self.leftMeetingSpaceId = undefined;
        self.leftMeetingSpaceWasAGrabbedTable = false;
      }
    }))
);

export {MainStore};
