import {request} from 'api/request';
import {RequestInterface} from 'api/interfaces';

import {BEVersionRequest, BEVersionResponse} from './versionRepository.api.types';
import {versionRepositoryEndpoints} from './versionRepository.api.endpoints';

export const fetchVersion: RequestInterface<BEVersionRequest, BEVersionResponse> = (options) => {
  return request.get(versionRepositoryEndpoints().version, options);
};
