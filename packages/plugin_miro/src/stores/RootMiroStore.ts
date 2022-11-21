import {flow, Instance, types} from 'mobx-state-tree';
import {ResetModel} from '@momentum-xyz/core';
import {AppConfigInterface, MiroApiInterface} from 'core/interfaces';
import {appVariables} from 'api/constants';
import {ApiInterface, AttributeNameEnum, PluginIdEnum} from '@momentum-xyz/sdk';

import {MiroBoardStore} from './MiroBoardStore.ts';

const RootMiroStore = types
  .compose(
    ResetModel,
    types.model('RootMiroStore', {
      api: types.frozen<MiroApiInterface>(),
      attributesApi: types.frozen<ApiInterface>(),
      spaceId: types.maybe(types.string),
      miroBoardStore: types.optional(MiroBoardStore, {}),
      spaceName: types.maybe(types.string)
    })
  )
  .actions((self) => ({
    init: flow(function* (spaceId: string) {
      const config: AppConfigInterface = yield self.api.getConfig();

      Object.entries(config).forEach((entry) => {
        const [key, value] = entry;
        appVariables[key as keyof AppConfigInterface] = value;
      });

      self.spaceId = spaceId;

      self.spaceName = yield self.attributesApi.getSpaceAttributeItem(
        spaceId,
        AttributeNameEnum.NAME,
        AttributeNameEnum.NAME,
        PluginIdEnum.CORE
      );
    })
  }));

export type RootMiroStoreType = Instance<typeof RootMiroStore>;

export {RootMiroStore};
