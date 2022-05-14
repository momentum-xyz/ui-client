import {request} from 'api/request';
import {RequestInterface} from 'api/interfaces';

import {FindTableRequest, FindTableResponse} from './tablesRepository.api.types';
import {tablesRepositoryEndpoints} from './tablesRepository.api.endpoints';

export const findTable: RequestInterface<FindTableRequest, FindTableResponse> = (options) => {
  const {userId, ...restOptions} = options;

  const URL = `${tablesRepositoryEndpoints.find}/${userId}`;

  return request.get(URL, restOptions);
};
