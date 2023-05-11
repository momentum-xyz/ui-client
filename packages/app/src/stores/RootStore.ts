import {Instance, types} from 'mobx-state-tree';

import {UniverseStore} from 'stores/UniverseStore';
import {WidgetsStore} from 'scenes/widgets/stores/WidgetsStore';
import {CreatorStore} from 'scenes/widgets/stores/CreatorStore';
import {ObjectStore} from 'scenes/object/stores';

import {NftStore} from './NftStore';
import {ConfigStore} from './ConfigStore';
import {ThemeStore} from './ThemeStore';
import {SessionStore} from './SessionStore';
import {AgoraStore} from './AgoraStore';
import {SentryStore} from './SentryStore';
import {WidgetManagerStore} from './WidgetManagerStore';

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

    /* Connect independent stores */
    creatorStore: types.optional(CreatorStore, {}),
    widgetStore: types.optional(WidgetsStore, {}),
    objectStore: types.optional(ObjectStore, {})
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
