import {types} from 'mobx-state-tree';

import {ResetModel} from 'core/models';

import {
  ThemeStore,
  SentryStore,
  UnityStore,
  WorldStore,
  FavoriteStore,
  AgoraStore,
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
      agoraStore: types.optional(AgoraStore, {})
    })
    .actions((self) => ({
      init(): void {
        self.sentryStore.init();
        self.unityStore.init();
        self.agoraStore.init();
      },
      initBroadcast(spaceId: string): void {
        self.liveStreamStore.fetchBroadcast(spaceId);
      }
    }))
);

export {MainStore};
