import {Method} from 'axios';

import {request} from 'api/request';
import {RequestInterface} from 'api/interfaces';

import {UpdateUserRequest, UpdateUserResponse} from './profileRepository.api.types';
import {userRepositoryEndpoints} from './profileRepository.api.endpoints';

export const update: RequestInterface<UpdateUserRequest, UpdateUserResponse> = (options) => {
  const {name, profile, ...rest} = options;
  const requestParams = {
    method: 'put' as Method,
    data: {name, profile},
    ...rest
  };

  return request(userRepositoryEndpoints().edit, requestParams);
};
