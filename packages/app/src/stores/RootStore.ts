import {Instance, types, flow} from 'mobx-state-tree';

import {SignInAccountStore} from 'scenes/auth/stores/SignInAccountStore';
import {ExploreStore} from 'scenes/explore/stores/ExploreStore';
import {RootCollaborationStore} from 'scenes/collaboration/stores';
import {RootMeetingStore} from 'scenes/meeting/stores';
import {RootFlightStore} from 'scenes/flight/stores';
import {RootWidgetsStore} from 'scenes/widgets/stores/RootWidgetsStore';
import {RootWidgetStore_OLD} from 'scenes/widgets_OLD/stores/RootWidgetStore_OLD';
import {RootSpaceAdminStore} from 'scenes/spaceAdmin/stores';
import {OdysseyStore} from 'scenes/odyssey/stores';
import {MagicStore} from 'scenes/magic/stores/MagicStore/MagicStore';
import {VideoStore} from 'scenes/video/stores';
import {RootOdysseyCreatorStore} from 'scenes/odysseyCreator/stores';
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
    exploreStore: types.optional(ExploreStore, {}),
    odysseyStore: types.optional(OdysseyStore, {}),
    collaborationStore: types.optional(RootCollaborationStore, {}),
    meetingStore: types.optional(RootMeetingStore, {}),
    flightStore: types.optional(RootFlightStore, {}),
    spaceAdminStore: types.optional(RootSpaceAdminStore, {}),
    widgetsStore: types.optional(RootWidgetsStore, {}),
    widgetStore_OLD: types.optional(RootWidgetStore_OLD, {}),
    odysseyCreatorStore: types.optional(RootOdysseyCreatorStore, {}),
    magicStore: types.optional(MagicStore, {}),
    videoStore: types.optional(VideoStore, {}),
    objectStore: types.optional(ObjectStore, {})
  })
  .actions((self) => ({
    async initApplication() {
      await self.configStore.init();
      await self.nftStore.init();
      await self.nftStore.initWeb3ExtensionIfNeeded();
      self.authStore.tryToRestoreWallet();
      self.mainStore.themeStore.init();
    },
    unityLoaded(worldId: string): void {
      self.mainStore.unityStore.teleportIsReady();
      self.mainStore.worldStore.init(worldId);
      self.agoraStore.init(worldId, self.sessionStore.userId);
    },
    openObject: flow(function* (objectId: string) {
      yield self.objectStore.init(objectId);
    }),
    closeObject() {
      self.objectStore.deinit();
    }
  }));

export type RootStoreType = Instance<typeof RootStore>;

export {RootStore};
