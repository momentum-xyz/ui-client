import {types} from 'mobx-state-tree';
import {ResetModel} from '@momentum-xyz/core';

import {PluginsStore} from 'stores/MainStore/models/PluginsStore';

import {
  ThemeStore,
  SentryStore,
  UnityStore,
  WorldStore,
  FavoriteStore,
  LiveStreamStore
} from './models';

const MainStore = types.compose(
  ResetModel,
  types
    .model('MainStore', {
      themeStore: types.optional(ThemeStore, {}),
      sentryStore: types.optional(SentryStore, {}),
      unityStore: types.optional(UnityStore, {}),
      worldStore: types.optional(WorldStore, {}),
      favoriteStore: types.optional(FavoriteStore, {}),
      liveStreamStore: types.optional(LiveStreamStore, {}),
      pluginsStore: types.optional(PluginsStore, {})
    })
    .actions((self) => ({
      init(): void {
        self.sentryStore.init();
        self.unityStore.init();
      },
      initBroadcast(spaceId: string): void {
        self.liveStreamStore.fetchBroadcast(spaceId);
      }
    }))
);

export {MainStore};
