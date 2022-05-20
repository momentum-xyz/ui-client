import {RequestInterface} from 'api/interfaces';
import {request} from 'api/request';

import {statusRepositoryEndpoints} from './statusRepository.api.endpoints';
import {StatusRequestInterface, StatusResponseInterface} from './statusRepository.api.types';

export const changeStatus: RequestInterface<StatusRequestInterface, StatusResponseInterface> = (
  options
) => {
  const {status, ...restOptions} = options;

  return request.put(statusRepositoryEndpoints.base, {status}, restOptions);
};
