import {request} from 'api/request';
import {RequestInterface} from 'api/interfaces';

import {BackendVersionRequest, BackendVersionResponse} from './versionRepository.api.types';
import {versionRepositoryEndpoints} from './versionRepository.api.endpoints';

export const fetchVersion: RequestInterface<BackendVersionRequest, BackendVersionResponse> = (
  options
) => {
  return request.get(versionRepositoryEndpoints().version, options);
};
