import {Instance, types, flow} from 'mobx-state-tree';

import {PosBusEventEnum} from 'core/enums';
import {SignInAccountStore} from 'scenes/auth/stores/SignInAccountStore';
import {ExploreStore} from 'scenes/explore/stores/ExploreStore';
import {Map3dStore} from 'scenes/map3d/stores/Map3dStore';
import {RootCollaborationStore} from 'scenes/collaboration/stores';
import {RootMeetingStore} from 'scenes/meeting/stores';
import {RootFlightStore} from 'scenes/flight/stores';
import {RootWidgetsStore} from 'scenes/widgets/stores/RootWidgetsStore';
import {RootWidgetStore_OLD} from 'scenes/widgets_OLD/stores/RootWidgetStore_OLD';
import {RootSpaceAdminStore} from 'scenes/spaceAdmin/stores';
import {OdysseyStore} from 'scenes/odyssey/stores';
import {MagicStore} from 'scenes/magic/stores/MagicStore/MagicStore';
import {VideoStore} from 'scenes/video/stores';
import {RootWorldBuilderStore} from 'scenes/worldBuilder/stores';
import {StreamChatStore} from 'scenes/collaboration/stores/StreamChatStore';
import {ObjectStore} from 'scenes/object/stores';

import {NftStore} from './NftStore';
import {AuthStore} from './AuthStore';
import {MainStore} from './MainStore';
import {ConfigStore} from './ConfigStore';
import {SessionStore} from './SessionStore';
import {AgoraStore} from './AgoraStore';

const RootStore = types
  .model('RootStore', {
    /* Connect core stores */
    configStore: types.optional(ConfigStore, {}),
    nftStore: types.optional(NftStore, {}),
    authStore: types.optional(AuthStore, {}),
    mainStore: types.optional(MainStore, {}),
    sessionStore: types.optional(SessionStore, {}),
    agoraStore: types.optional(AgoraStore, {}),
    /* Connect independent stores */
    signInAccountStore: types.optional(SignInAccountStore, {}),
    map3dStore: types.optional(Map3dStore, {}),
    exploreStore: types.optional(ExploreStore, {}),
    odysseyStore: types.optional(OdysseyStore, {}),
    collaborationStore: types.optional(RootCollaborationStore, {}),
    meetingStore: types.optional(RootMeetingStore, {}),
    flightStore: types.optional(RootFlightStore, {}),
    spaceAdminStore: types.optional(RootSpaceAdminStore, {}),
    widgetsStore: types.optional(RootWidgetsStore, {}),
    widgetStore_OLD: types.optional(RootWidgetStore_OLD, {}),
    worldBuilderStore: types.optional(RootWorldBuilderStore, {}),
    worldChatStore: types.optional(StreamChatStore, {}),
    magicStore: types.optional(MagicStore, {}),
    videoStore: types.optional(VideoStore, {}),
    objectStore: types.optional(ObjectStore, {})
  })
  .actions((self) => ({
    async initApplication() {
      await self.configStore.init();
      await self.nftStore.init();
      self.authStore.tryToRestoreWallet();
      self.mainStore.themeStore.init();
    },
    unityLoaded(worldId: string): void {
      self.mainStore.favoriteStore.init();
      self.mainStore.unityStore.teleportIsReady();
      self.mainStore.worldStore.init(worldId);
      self.agoraStore.init(worldId, self.sessionStore.userId);
    },
    // TODO: To be removed, do not use in new code
    joinMeetingSpace: flow(function* (spaceId: string, isTable = false) {
      console.log('---JOINING---');

      yield self.collaborationStore.join(spaceId, isTable);
      yield self.agoraStore.joinVoiceChat();
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
    // TODO: To be removed, do not use in new code
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
        yield self.agoraStore.leaveVoiceChat();
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
    }),
    openObject: flow(function* (objectId: string) {
      yield self.objectStore.init(objectId);
    }),
    closeObject() {
      self.objectStore.deinit();
    }
  }));

export type RootStoreType = Instance<typeof RootStore>;

export {RootStore};
