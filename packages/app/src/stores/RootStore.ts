import {Instance, types} from 'mobx-state-tree';

import {SignInStore} from 'scenes/auth/stores';
import {UnityStore} from 'scenes/unity/stores';
import {ExploreStore} from 'scenes/explore/stores/ExploreStore';
import {RootCollaborationStore} from 'scenes/collaboration/stores';
import {RootMeetingStore} from 'scenes/meeting/stores';
import {RootFlightStore} from 'scenes/flight/stores';
import {RootWidgetsStore} from 'scenes/widgets/stores/RootWidgetsStore';
import {RootWidgetStore_OLD} from 'scenes/widgets_OLD/stores/RootWidgetStore_OLD';
import {RootSpaceAdminStore} from 'scenes/spaceAdmin/stores';
import {MagicStore} from 'scenes/magic/stores/MagicStore/MagicStore';
import {RootOdysseyCreatorStore} from 'scenes/odysseyCreator/stores';
import {ObjectStore} from 'scenes/object/stores';

import {NftStore} from './NftStore';
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
    sessionStore: types.optional(SessionStore, {}),
    agoraStore: types.optional(AgoraStore, {}),
    sentryStore: types.optional(SentryStore, {}),

    /* Connect independent stores */
    unityStore: types.optional(UnityStore, {}),
    signInStore: types.optional(SignInStore, {}),
    exploreStore: types.optional(ExploreStore, {}),
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
    spaceAdminStore: types.optional(RootSpaceAdminStore, {})
  })
  .actions((self) => ({
    async initApplication() {
      await self.configStore.init();
      await self.nftStore.init();
      await self.nftStore.initWeb3ExtensionIfNeeded();

      self.agoraStore.userDevicesStore.init();
      self.themeStore.init();
    }
  }));

export type RootStoreType = Instance<typeof RootStore>;

export {RootStore};
