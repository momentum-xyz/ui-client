import {types} from 'mobx-state-tree';

import {ResetModel} from 'core/models';

import {ThemeStore, SentryStore, UnityStore, WorldStore, FavoriteStore} from './models';

const MainStore = types.compose(
  ResetModel,
  types
    .model('MainStore', {
      themeStore: types.optional(ThemeStore, {}),
      sentryStore: types.optional(SentryStore, {}),
      unityStore: types.optional(UnityStore, {}),
      worldStore: types.optional(WorldStore, {}),
      favoriteStore: types.optional(FavoriteStore, {})
    })
    .actions((self) => ({
      init(): void {
        self.sentryStore.init();
        self.unityStore.init();
      }
    }))
);

export {MainStore};
