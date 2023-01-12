import {Instance, types} from 'mobx-state-tree';

import {UnityStore} from 'scenes/unity/stores';
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
import {ConfigStore} from './ConfigStore';
import {ThemeStore} from './ThemeStore';
import {SessionStore} from './SessionStore';
import {AgoraStore} from './AgoraStore';
import {AgoraStore_OLD} from './AgoraStore_OLD';
import {LiveStreamStore_OLD} from './LiveStreamStore_OLD';
import {SentryStore} from './SentryStore';

const RootStore = types
  .model('RootStore', {
    /* Connect core stores */
    configStore: types.optional(ConfigStore, {}),
    nftStore: types.optional(NftStore, {}),
    themeStore: types.optional(ThemeStore, {}),
    authStore: types.optional(AuthStore, {}),
    sessionStore: types.optional(SessionStore, {}),
    agoraStore: types.optional(AgoraStore, {}),
    sentryStore: types.optional(SentryStore, {}),

    /* Connect independent stores */
    unityStore: types.optional(UnityStore, {}),
    signInAccountStore: types.optional(SignInAccountStore, {}),
    exploreStore: types.optional(ExploreStore, {}),
    odysseyStore: types.optional(OdysseyStore, {}),
    objectStore: types.optional(ObjectStore, {}),
    widgetsStore: types.optional(RootWidgetsStore, {}),
    odysseyCreatorStore: types.optional(RootOdysseyCreatorStore, {}),
    magicStore: types.optional(MagicStore, {}),

    /* TODO: Removal or refactoring.  */
    agoraStore_OLD: types.optional(AgoraStore_OLD, {}),
    widgetStore_OLD: types.optional(RootWidgetStore_OLD, {}),
    liveStreamStore_OLD: types.optional(LiveStreamStore_OLD, {}),
    collaborationStore: types.optional(RootCollaborationStore, {}),
    meetingStore: types.optional(RootMeetingStore, {}),
    flightStore: types.optional(RootFlightStore, {}),
    spaceAdminStore: types.optional(RootSpaceAdminStore, {}),
    videoStore: types.optional(VideoStore, {})
  })
  .actions((self) => ({
    async initApplication() {
      await self.configStore.init();
      await self.nftStore.init();
      await self.nftStore.initWeb3ExtensionIfNeeded();

      self.authStore.tryToRestoreWallet();
      self.agoraStore.userDevicesStore.init();
      self.themeStore.init();
    },
    unityLoaded(worldId: string): void {
      self.unityStore.unityInstanceStore.teleportIsReady();
      self.unityStore.unityWorldStore.init(worldId);
    }
  }));

export type RootStoreType = Instance<typeof RootStore>;

export {RootStore};
