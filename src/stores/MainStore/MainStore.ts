import {types} from 'mobx-state-tree';

import {ResetModel} from 'core/models';

import {ThemeStore, SentryStore, UnityStore, WorldStore} from './models';

const MainStore = types.compose(
  ResetModel,
  types
    .model('MainStore', {
      themeStore: types.optional(ThemeStore, {}),
      sentryStore: types.optional(SentryStore, {}),
      unityStore: types.optional(UnityStore, {}),
      worldStore: types.optional(WorldStore, {})
    })
    .actions((self) => ({
      init(): void {
        self.themeStore.init();
      }
    }))
);

export {MainStore};
