import {flow, Instance, types} from 'mobx-state-tree';
import {ResetModel} from '@momentum-xyz/core';
import {AppConfigInterface, MiroAPIInterface} from 'core/interfaces';
import {appVariables} from 'api/constants';

import {MiroBoardStore} from './MiroBoardStore.ts';

const RootMiroStore = types
  .compose(
    ResetModel,
    types.model('RootMiroStore', {
      api: types.frozen<MiroAPIInterface>(),
      miroBoardStore: types.optional(MiroBoardStore, {})
    })
  )
  .actions((self) => ({
    init: flow(function* () {
      const config: AppConfigInterface = yield self.api.getConfig();

      Object.entries(config).forEach((entry) => {
        const [key, value] = entry;
        appVariables[key as keyof AppConfigInterface] = value;
      });
    })
  }));

export type RootMiroStoreType = Instance<typeof RootMiroStore>;

export {RootMiroStore};
