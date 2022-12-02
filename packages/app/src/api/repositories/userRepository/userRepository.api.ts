import {generatePath} from 'react-router-dom';

import {request} from 'api/request';
import {RequestInterface} from 'api/interfaces';

import {
  CheckUserRequest,
  CheckUserResponse,
  FetchMeRequest,
  FetchMeResponse,
  FetchUserRequest,
  FetchUserResponse
} from './userRepository.api.types';
import {userRepositoryEndpoints} from './userRepository.api.endpoints';

export const check: RequestInterface<CheckUserRequest, CheckUserResponse> = (options) => {
  const {idToken, ...restOptions} = options;

  return request.post(userRepositoryEndpoints().check, {idToken}, restOptions);
};

export const fetchMe: RequestInterface<FetchMeRequest, FetchMeResponse> = (options) => {
  return request.get(userRepositoryEndpoints().me, options);
};

export const fetchUser: RequestInterface<FetchUserRequest, FetchUserResponse> = (options) => {
  const {userId, ...restOptions} = options;

  const url = generatePath(userRepositoryEndpoints().profile, {userId});

  return request.get(url, restOptions);
};
