import {types, flow} from 'mobx-state-tree';
import {RequestModel} from '@momentum-xyz/core';

import {api, AppConfigResponse, BackendVersionResponse} from 'api';
import {appVariables, appVariablesOverrides} from 'api/constants';
import {AppConfigInterface} from 'api/interfaces';

const ConfigStore = types
  .model('ConfigStore', {
    versionRequest: types.optional(RequestModel, {}),
    configRequest: types.optional(RequestModel, {}),
    isConfigReady: false
  })
  .actions((self) => ({
    init: flow(function* () {
      const versionResponse: BackendVersionResponse = yield self.versionRequest.send(
        api.versionRepository.fetchVersion,
        {}
      );

      if (versionResponse) {
        appVariables.BACKEND_API_URL = `${appVariables.BE_URL}/api/v${versionResponse.api.major}`;

        const configResponse: AppConfigResponse = yield self.configRequest.send(
          api.configRepository.fetchConfig,
          {}
        );

        if (configResponse) {
          Object.entries(configResponse).forEach(([key, value]) => {
            appVariables[key as keyof AppConfigInterface] = value;
          });

          Object.entries(appVariablesOverrides).forEach(([key, value]) => {
            appVariables[key as keyof AppConfigInterface] = value as any;
          });

          // TODO: Figure out how to share those below and remove ts-ignore
          // @ts-ignore window['env'] does not resolve typing
          window['env'] = {
            BACKEND_ENDPOINT_URL: appVariables.BACKEND_ENDPOINT_URL,
            APP_ID: appVariables.MIRO_APP_ID
          };

          self.isConfigReady = true;
        }
      }
    })
  }))
  .views((self) => ({
    get isError(): boolean {
      return self.versionRequest.isError || self.configRequest.isError;
    }
  }));

export {ConfigStore};
