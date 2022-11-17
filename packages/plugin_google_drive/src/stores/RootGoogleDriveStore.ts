import {flow, Instance, types} from 'mobx-state-tree';
import {ResetModel} from '@momentum-xyz/core';
import {AppConfigInterface, GoogleDriveApiInterface} from 'core/interfaces';
import {appVariables} from 'api/constants';

import {GoogleDriveStore} from './GoogleDriveStore';

const RootGoogleDriveStore = types
  .compose(
    ResetModel,
    types.model('RootGoogleDriveStore', {
      api: types.frozen<GoogleDriveApiInterface>(),
      googleDriveStore: types.optional(GoogleDriveStore, {})
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

export type RootGoogleDriveStoreType = Instance<typeof RootGoogleDriveStore>;

export {RootGoogleDriveStore};
