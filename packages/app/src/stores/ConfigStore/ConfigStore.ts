import {types, flow} from 'mobx-state-tree';
import {RequestModel} from '@momentum-xyz/core';

import {api, AppConfigResponse, BackendVersionResponse} from 'api';
import {appVariables, appVariablesOverrides} from 'api/constants';
import {AppConfigInterface} from 'api/interfaces';

const ConfigStore = types
  .model('ConfigStore', {
    versionRequest: types.optional(RequestModel, {}),
    configRequest: types.optional(RequestModel, {}),
    isConfigReady: false,
    isAgoraActive: false
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
            appVariables[key as keyof AppConfigInterface] = value as string;
          });

          //appVariables.AI_PROVIDERS.leonardo = true;
          //appVariables.AI_PROVIDERS.chatgpt = true;

          self.isConfigReady = true;
          self.isAgoraActive = !!appVariables.AGORA_APP_ID;
        }
      }
    })
  }))
  .views((self) => ({
    get isError(): boolean {
      return self.versionRequest.isError || self.configRequest.isError;
    },
    get configLoadingErrorCode(): number | null {
      return self.versionRequest.errorCode || self.configRequest.errorCode;
    }
  }));

export {ConfigStore};
