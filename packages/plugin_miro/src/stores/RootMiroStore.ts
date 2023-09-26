import {flow, Instance, types} from 'mobx-state-tree';
import {ResetModel} from '@momentum-xyz/core';
import {AppConfigInterface} from 'core/interfaces';
import {appVariables} from 'api/constants';
import {ApiInterface, PluginApiInterface} from '@momentum-xyz/sdk';

import {MiroBoardStore} from './MiroBoardStore.ts';

const RootMiroStore = types
  .compose(
    ResetModel,
    types.model('RootMiroStore', {
      api: types.frozen<PluginApiInterface<AppConfigInterface>>(),
      attributesApi: types.frozen<ApiInterface>(),
      objectId: types.maybe(types.string),
      miroBoardStore: types.optional(MiroBoardStore, {})
    })
  )
  .actions((self) => ({
    init: flow(function* (objectId: string) {
      const config = yield self.api.getConfig();

      Object.entries(config).forEach((entry) => {
        const [key, value] = entry;
        appVariables[key as keyof AppConfigInterface] = value;
      });

      self.objectId = objectId;
    })
  }));

export type RootMiroStoreType = Instance<typeof RootMiroStore>;

export {RootMiroStore};
