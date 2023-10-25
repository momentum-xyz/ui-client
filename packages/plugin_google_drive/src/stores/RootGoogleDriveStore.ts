import {flow, Instance, types} from 'mobx-state-tree';
import {ResetModel} from '@momentum-xyz/core';
import {AppConfigInterface} from 'core/interfaces';
import {appVariables} from 'api/constants';
import {AttributeNameEnum, PluginApiInterface} from '@momentum-xyz/sdk';

import {GoogleDriveStore} from './GoogleDriveStore';

const RootGoogleDriveStore = types
  .compose(
    ResetModel,
    types.model('RootGoogleDriveStore', {
      api: types.frozen<PluginApiInterface<AppConfigInterface>>(),
      googleDriveStore: types.optional(GoogleDriveStore, {}),
      objectId: types.maybe(types.string)
    })
  )
  .actions((self) => ({
    init: flow(function* (objectId: string) {
      const config = yield self.api.getConfig();
      self.objectId = objectId;

      Object.entries(config).forEach((entry) => {
        const [key, value] = entry;
        appVariables[key as keyof AppConfigInterface] = value;
      });

      self.spaceName = yield self.api.getStateItem(AttributeNameEnum.NAME);
    })
  }));

export type RootGoogleDriveStoreType = Instance<typeof RootGoogleDriveStore>;

export {RootGoogleDriveStore};
