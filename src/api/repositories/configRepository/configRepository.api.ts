import {request} from 'api/request';
import {RequestInterface} from 'api/interfaces';

import {AppConfigRequest, AppConfigResponse} from './configRepository.api.types';
import {configRepositoryEndpoints} from './configRepository.api.endpoints';

export const fetchConfig: RequestInterface<AppConfigRequest, AppConfigResponse> = (options) => {
  return request.get(configRepositoryEndpoints.config, options);
};
