import {types, flow} from 'mobx-state-tree';

import {RequestModel} from 'core/models';
import {api, AppConfigResponse} from 'api';
import {appVariables} from 'api/constants';
import {AppConfigInterface} from 'api/interfaces';

const ConfigStore = types
  .model('ConfigStore', {
    request: types.optional(RequestModel, {}),
    isConfigReady: false
  })
  .actions((self) => ({
    init: flow(function* () {
      const configResponse: AppConfigResponse = yield self.request.send(
        api.configRepository.fetchConfig,
        {}
      );

      if (configResponse) {
        Object.entries(configResponse).forEach((entry) => {
          const [key, value] = entry;
          appVariables[key as keyof AppConfigInterface] = value;
        });

        self.isConfigReady = true;
      }
    })
  }));

export {ConfigStore};
