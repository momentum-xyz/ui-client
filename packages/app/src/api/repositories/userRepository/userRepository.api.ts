import {request} from 'api/request';
import {RequestInterface} from 'api/interfaces';

import {
  CheckUserRequest,
  CheckUserResponse,
  FetchUserRequest,
  FetchUserResponse
} from './userRepository.api.types';
import {userRepositoryEndpoints} from './userRepository.api.endpoints';

export const check: RequestInterface<CheckUserRequest, CheckUserResponse> = (options) => {
  const {idToken, ...restOptions} = options;

  return request.post(userRepositoryEndpoints().check, {idToken}, restOptions);
};

export const fetchMe: RequestInterface<FetchUserRequest, FetchUserResponse> = (options) => {
  return request.get(userRepositoryEndpoints().me, options);
};
