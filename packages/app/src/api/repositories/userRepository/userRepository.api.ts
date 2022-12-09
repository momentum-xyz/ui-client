import {generatePath} from 'react-router-dom';

import {request} from 'api/request';
import {RequestInterface} from 'api/interfaces';

import {
  CheckUserRequest,
  CheckUserResponse,
  FetchMeRequest,
  FetchMeResponse,
  FetchUserRequest,
  FetchUserResponse,
  MutualDocksRequest,
  MutualDocksResponse
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

export const createMutualDocks: RequestInterface<MutualDocksRequest, MutualDocksResponse> = (
  options
) => {
  const {walletA, walletB, ...restOptions} = options;

  return request.post(userRepositoryEndpoints().mutualDocks, {walletA, walletB}, restOptions);
};

export const destroyMutualDocks: RequestInterface<MutualDocksRequest, MutualDocksResponse> = (
  options
) => {
  const {walletA, walletB, ...restOptions} = options;

  restOptions.data = {walletA, walletB};

  return request.delete(userRepositoryEndpoints().mutualDocks, restOptions);
};
