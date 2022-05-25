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
    fetchConfig: flow(function* () {
      const configResponse: AppConfigResponse = yield self.request.send(
        api.configRepository.fetchConfig,
        {}
      );

      if (configResponse) {
        Object.entries(configResponse).forEach((entry) => {
          const [key, value] = entry;
          appVariables[key as keyof AppConfigInterface] = value;
        });

        console.log(appVariables);
        self.isConfigReady = true;
      }
    })
  }))
  .views((self) => ({
    get isConfigWrong() {
      return self.request.isError;
    }
  }));
export {ConfigStore};
