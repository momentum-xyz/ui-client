import {request} from 'api/request';
import {RequestInterface} from 'api/interfaces';

import {UpdateUserRequest, UpdateUserResponse} from './userProfileRepository.api.types';
import {userRepositoryEndpoints} from './userProfileRepository.api.endpoints';

export const update: RequestInterface<UpdateUserRequest, UpdateUserResponse> = (options) => {
  const {name, profile, ...rest} = options;

  return request.patch(userRepositoryEndpoints().base, {name, profile}, rest);
};
