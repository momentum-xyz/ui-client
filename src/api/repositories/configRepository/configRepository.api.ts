import {request} from 'api/request';
import {RequestInterface} from 'api/interfaces';

import {EnvVariablesRequest, EnvVariablesResponse} from './configRepository.api.types';
import {configRepositoryEndpoints} from './configRepository.api.endpoints';

export const fetchVariables: RequestInterface<EnvVariablesRequest, EnvVariablesResponse> = (
  options
) => {
  return request.get(configRepositoryEndpoints.variables, options);
};
