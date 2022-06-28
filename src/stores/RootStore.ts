import {Instance, types} from 'mobx-state-tree';

import {RootCommunicationStore} from 'scenes/communication/stores';
import {RootAuthStore} from 'scenes/auth/stores';
import {RootDefaultStore} from 'scenes/default/stores';
import {RootSystemStore} from 'scenes/system/stores';
import {RootProfileStore} from 'scenes/profile/stores';
import {RootCollaborationStore} from 'scenes/collaboration/stores';
import {RootWidgetStore} from 'scenes/widgets/stores/RootWidgetStore';
import {RootSpaceAdminStore} from 'scenes/spaceAdmin/stores';
import {RootWorldCalendarStore} from 'scenes/worldCalendar/stores';
import {MagicStore} from 'scenes/magic/stores/MagicStore/MagicStore';

import {ConfigStore} from './ConfigStore';
import {MainStore} from './MainStore';
import {SessionStore} from './SessionStore';
import {FavoriteStore} from './FavoriteStore';

const RootStore = types
  .model('RootStore', {
    /* Connect core stores */
    configStore: types.optional(ConfigStore, {}),
    mainStore: types.optional(MainStore, {}),
    sessionStore: types.optional(SessionStore, {}),
    /* Connect independent stores */
    authStore: types.optional(RootAuthStore, {}),
    defaultStore: types.optional(RootDefaultStore, {}),
    systemStore: types.optional(RootSystemStore, {}),
    profileStore: types.optional(RootProfileStore, {}),
    collaborationStore: types.optional(RootCollaborationStore, {}),
    communicationStore: types.optional(RootCommunicationStore, {}),
    worldCalendarStore: types.optional(RootWorldCalendarStore, {}),
    spaceAdminStore: types.optional(RootSpaceAdminStore, {}),
    widgetStore: types.optional(RootWidgetStore, {}),
    favoriteStore: types.optional(FavoriteStore, {}),
    magicStore: types.optional(MagicStore, {})
  })
  .actions((self) => ({
    initApplication(): void {
      self.configStore.init();
      self.mainStore.themeStore.init();
    },
    applicationLoaded(worldId: string): void {
      self.favoriteStore.init();
      self.mainStore.unityStore.teleportIsReady();
      self.mainStore.worldStore.init(worldId);
    }
  }));

export interface RootStoreInterface extends Instance<typeof RootStore> {}

export {RootStore};
