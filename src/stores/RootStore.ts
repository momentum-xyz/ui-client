import {Instance, types, flow} from 'mobx-state-tree';

import {PosBusEventEnum} from 'core/enums';
import {RootAuthStore} from 'scenes/auth/stores';
import {RootSystemStore} from 'scenes/system/stores';
import {RootProfileStore} from 'scenes/profile/stores';
import {RootCollaborationStore} from 'scenes/collaboration/stores';
import {RootMeetingStore} from 'scenes/meeting/stores';
import {RootWidgetStore} from 'scenes/widgets/stores/RootWidgetStore';
import {RootSpaceAdminStore} from 'scenes/spaceAdmin/stores';
import {RootWorldCalendarStore} from 'scenes/worldCalendar/stores';
import {HomeStore} from 'scenes/home/stores';
import {MagicStore} from 'scenes/magic/stores/MagicStore/MagicStore';
import {VideoStore} from 'scenes/video/stores';

import {ConfigStore} from './ConfigStore';
import {MainStore} from './MainStore';
import {SessionStore} from './SessionStore';

const RootStore = types
  .model('RootStore', {
    /* Connect core stores */
    configStore: types.optional(ConfigStore, {}),
    mainStore: types.optional(MainStore, {}),
    sessionStore: types.optional(SessionStore, {}),
    /* Connect independent stores */
    authStore: types.optional(RootAuthStore, {}),
    homeStore: types.optional(HomeStore, {}),
    systemStore: types.optional(RootSystemStore, {}),
    profileStore: types.optional(RootProfileStore, {}),
    collaborationStore: types.optional(RootCollaborationStore, {}),
    meetingStore: types.optional(RootMeetingStore, {}),
    worldCalendarStore: types.optional(RootWorldCalendarStore, {}),
    spaceAdminStore: types.optional(RootSpaceAdminStore, {}),
    widgetStore: types.optional(RootWidgetStore, {}),
    magicStore: types.optional(MagicStore, {}),
    videoStore: types.optional(VideoStore, {})
  })
  .actions((self) => ({
    initApplication(): void {
      self.configStore.init();
      self.mainStore.themeStore.init();
    },
    unityLoaded(worldId: string): void {
      self.mainStore.favoriteStore.init();
      self.mainStore.unityStore.teleportIsReady();
      self.mainStore.worldStore.init(worldId);
    },
    joinMeetingSpace: flow(function* (spaceId: string, isTable = false) {
      console.log(`-------JOINING------- ${self.collaborationStore.leftMeetingSpaceId}`);
      yield self.collaborationStore.joinMeetingSpace(spaceId, isTable);
      yield self.mainStore.agoraStore.joinMeetingSpace(self.sessionStore.userId, spaceId);

      self.mainStore.unityStore.triggerInteractionMessage(
        PosBusEventEnum.EnteredSpace,
        spaceId,
        0,
        ''
      );

      console.log(`-------JOINED------- ${self.collaborationStore.leftMeetingSpaceId}`);
    }),
    leaveMeetingSpace: flow(function* () {
      console.log(`-------LEAVING------- ${self.collaborationStore.leftMeetingSpaceId}`);

      const spaceId = self.collaborationStore.space?.id;

      yield self.mainStore.agoraStore.leaveMeetingSpace();
      self.collaborationStore.leaveMeetingSpace();

      if (spaceId) {
        self.mainStore.unityStore.triggerInteractionMessage(
          PosBusEventEnum.LeftSpace,
          spaceId,
          0,
          ''
        );

        console.log(`-------LEFT------- ${self.collaborationStore.leftMeetingSpaceId}`);
      }
    })
  }));

export interface RootStoreInterface extends Instance<typeof RootStore> {}

export {RootStore};
