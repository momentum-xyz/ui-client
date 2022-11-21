import {Instance, types, flow} from 'mobx-state-tree';

import {PosBusEventEnum} from 'core/enums';
import {RootBirthOfMeStore} from 'scenes/birthOfMe/stores';
import {RootAuthStore} from 'scenes/auth/stores';
import {RootProfileStore} from 'scenes/profile/stores';
import {RootCollaborationStore} from 'scenes/collaboration/stores';
import {RootMeetingStore} from 'scenes/meeting/stores';
import {RootFlightStore} from 'scenes/flight/stores';
import {RootWidgetStore} from 'scenes/widgets/stores/RootWidgetStore';
import {RootSpaceAdminStore} from 'scenes/spaceAdmin/stores';
import {RootWorldCalendarStore} from 'scenes/worldCalendar/stores';
import {HomeStore} from 'scenes/home/stores';
import {MagicStore} from 'scenes/magic/stores/MagicStore/MagicStore';
import {VideoStore} from 'scenes/video/stores';
import {RootWorldBuilderStore} from 'scenes/worldBuilder/stores';
import {StreamChatStore} from 'scenes/collaboration/stores/StreamChatStore';

import {MainStore} from './MainStore';
import {ConfigStore} from './ConfigStore';
import {SessionStore} from './SessionStore';

const RootStore = types
  .model('RootStore', {
    /* Connect core stores */
    configStore: types.optional(ConfigStore, {}),
    mainStore: types.optional(MainStore, {}),
    sessionStore: types.optional(SessionStore, {}),
    /* Connect independent stores */
    birthOfMeStore: types.optional(RootBirthOfMeStore, {}),
    authStore: types.optional(RootAuthStore, {}),
    homeStore: types.optional(HomeStore, {}),
    profileStore: types.optional(RootProfileStore, {}),
    collaborationStore: types.optional(RootCollaborationStore, {}),
    meetingStore: types.optional(RootMeetingStore, {}),
    flightStore: types.optional(RootFlightStore, {}),
    worldCalendarStore: types.optional(RootWorldCalendarStore, {}),
    spaceAdminStore: types.optional(RootSpaceAdminStore, {}),
    widgetStore: types.optional(RootWidgetStore, {}),
    worldBuilderStore: types.optional(RootWorldBuilderStore, {}),
    worldChatStore: types.optional(StreamChatStore, {}),
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
      console.log('---JOINING---');

      yield self.collaborationStore.join(spaceId, isTable);
      yield self.mainStore.agoraStore.join(self.sessionStore.userId, spaceId);
      self.meetingStore.join(spaceId, isTable);

      self.mainStore.unityStore.triggerInteractionMessage(
        PosBusEventEnum.EnteredSpace,
        spaceId,
        0,
        ''
      );

      if (!self.collaborationStore.streamChatStore.isLoggedOn) {
        const {userId, user} = self.sessionStore;
        yield self.collaborationStore.streamChatStore.init(userId, spaceId, user ?? undefined);
      }

      console.log('---JOINED---');
    }),
    leaveMeetingSpace: flow(function* (isKicked = false) {
      console.log('---LEAVING---');

      const spaceId = self.collaborationStore.spaceStore?.id || '';
      self.meetingStore.leave(isKicked);
      self.collaborationStore.stageModeStore.removeAllPopups();

      /*
         FIXME: Sometimes Agora loses connection.
         Non-reproducible issue. Leave this for now. We will remove Agora later.
      */

      try {
        yield self.mainStore.agoraStore.leave();
      } catch (ex) {
        console.error('agoraStore.leave', ex);
      }

      try {
        yield self.collaborationStore.leave();
      } catch (ex) {
        console.error('collaborationStore.leave', ex);
      }

      try {
        self.mainStore.unityStore.triggerInteractionMessage(
          PosBusEventEnum.LeftSpace,
          spaceId,
          0,
          ''
        );
      } catch (ex) {
        console.error('collaborationStore.leave', ex);
      }

      console.log('---LEFT---');
    })
  }));

export type RootStoreType = Instance<typeof RootStore>;

export {RootStore};
