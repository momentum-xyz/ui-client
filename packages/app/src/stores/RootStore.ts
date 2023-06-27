import {Instance, types} from 'mobx-state-tree';

import {UniverseStore} from 'stores/UniverseStore';
import {WidgetsStore} from 'scenes/widgets/stores/WidgetsStore';

import {NftStore} from './NftStore';
import {ConfigStore} from './ConfigStore';
import {ThemeStore} from './ThemeStore';
import {SessionStore} from './SessionStore';
import {AgoraStore} from './AgoraStore';
import {SentryStore} from './SentryStore';
import {WidgetManagerStore} from './WidgetManagerStore';
import {MusicStore} from './MusicStore';

const RootStore = types
  .model('RootStore', {
    /* Connect core stores */
    configStore: types.optional(ConfigStore, {}),
    nftStore: types.optional(NftStore, {}),
    themeStore: types.optional(ThemeStore, {}),
    sessionStore: types.optional(SessionStore, {}),
    agoraStore: types.optional(AgoraStore, {}),
    sentryStore: types.optional(SentryStore, {}),
    universeStore: types.optional(UniverseStore, {}),
    widgetManagerStore: types.optional(WidgetManagerStore, {}),
    musicStore: types.optional(MusicStore, {}),

    /* Connect independent stores */
    widgetStore: types.optional(WidgetsStore, {})
  })
  .actions((self) => ({
    async initApplication() {
      await self.configStore.init();
      self.agoraStore.userDevicesStore.init();
      self.themeStore.init();
    },
    async refreshStakeRelatedData() {
      await self.nftStore.loadMyStakes();
      await self.nftStore.loadMyWallets();
      await self.sessionStore.loadStakedWorlds();
      await self.universeStore.world2dStore?.worldDetails?.fetchWorld();
    }
  }));

export type RootStoreType = Instance<typeof RootStore>;

export {RootStore};
