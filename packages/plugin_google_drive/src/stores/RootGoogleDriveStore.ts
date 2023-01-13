import {flow, Instance, types} from 'mobx-state-tree';
import {ResetModel} from '@momentum-xyz/core';
import {AppConfigInterface} from 'core/interfaces';
import {appVariables} from 'api/constants';
import {ApiInterface, AttributeNameEnum, PluginApiInterface} from '@momentum-xyz/sdk';

import {GoogleDriveStore} from './GoogleDriveStore';

const RootGoogleDriveStore = types
  .compose(
    ResetModel,
    types.model('RootGoogleDriveStore', {
      api: types.frozen<PluginApiInterface<AppConfigInterface>>(),
      googleDriveStore: types.optional(GoogleDriveStore, {}),
      attributesApi: types.frozen<ApiInterface>(),
      objectId: types.maybe(types.string)
    })
  )
  .actions((self) => ({
    init: flow(function* (spaceId: string) {
      const config = yield self.api.getConfig();
      self.objectId = spaceId;

      Object.entries(config).forEach((entry) => {
        const [key, value] = entry;
        appVariables[key as keyof AppConfigInterface] = value;
      });

      self.spaceName = yield self.attributesApi.getSpaceAttributeItem(
        spaceId,
        AttributeNameEnum.NAME,
        AttributeNameEnum.NAME
      );
    })
  }));

export type RootGoogleDriveStoreType = Instance<typeof RootGoogleDriveStore>;

export {RootGoogleDriveStore};
