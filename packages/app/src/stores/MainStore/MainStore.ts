import {types} from 'mobx-state-tree';
import {ResetModel} from '@momentum-xyz/core';

import {SentryStore, WorldStore} from './models';

const MainStore = types.compose(
  ResetModel,
  types
    .model('MainStore', {
      sentryStore: types.optional(SentryStore, {}),
      worldStore: types.optional(WorldStore, {})
    })
    .actions((self) => ({
      init(): void {
        self.sentryStore.init();
      }
    }))
);

export {MainStore};
