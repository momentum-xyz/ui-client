import {Method} from 'axios';
import {generatePath} from 'react-router-dom';

import {request} from 'api/request';
import {RequestInterface} from 'api/interfaces';

import {
  CheckUserRequest,
  CheckUserResponse,
  FetchUserInitiativesRequest,
  FetchUserInitiativesResponse,
  FetchUserRequest,
  FetchUserResponse,
  InviteToSpaceRequest,
  InviteToSpaceResponse,
  OnlineUsersRequest,
  OnlineUsersResponse,
  ProfileRequest,
  ProfileResponse,
  UserSearchRequest,
  UserSearchResponse
} from './userRepository.api.types';
import {userRepositoryEndpoints} from './userRepository.api.endpoints';

export const check: RequestInterface<CheckUserRequest, CheckUserResponse> = (options) => {
  const {idToken, ...rest} = options;
  const requestParams = {
    method: 'post' as Method,
    data: {idToken},
    ...rest
  };

  return request(userRepositoryEndpoints().check, requestParams);
};

export const fetchMe: RequestInterface<FetchUserRequest, FetchUserResponse> = (options) => {
  return request.get(userRepositoryEndpoints().me, options);
};

export const inviteToSpace: RequestInterface<InviteToSpaceRequest, InviteToSpaceResponse> = (
  options
) => {
  const {invitedUser, ...restOptions} = options;

  return request.post(userRepositoryEndpoints().inviteToSpace, invitedUser, restOptions);
};

export const search: RequestInterface<UserSearchRequest, UserSearchResponse> = (options) => {
  const {q, online, worldId, ...restOptions} = options;

  restOptions.params = {
    q,
    online: online && online.toString(),
    worldId
  };

  return request.get(userRepositoryEndpoints().search, restOptions);
};

export const fetchProfile: RequestInterface<ProfileRequest, ProfileResponse> = (options) => {
  const {userId, ...restOptions} = options;
  const URL = `${userRepositoryEndpoints().profile}/${userId}`;

  return request.get(URL, restOptions);
};

export const fetchOnlineUsers: RequestInterface<OnlineUsersRequest, OnlineUsersResponse> = (
  options
) => {
  const {worldId, ...restOptions} = options;
  const URL = `${userRepositoryEndpoints().online}/${worldId}`;

  return request.get(URL, restOptions);
};

export const fetchUserInitiatives: RequestInterface<
  FetchUserInitiativesRequest,
  FetchUserInitiativesResponse
> = (options) => {
  const {userId, ...restOptions} = options;

  const url = generatePath(userRepositoryEndpoints().initiatives, {userId});

  return request.get(url, restOptions);
};
