import {Method} from 'axios';

import {request} from 'api/request';
import {RequestInterface} from 'api/interfaces';

import {
  CheckUserRequest,
  CheckUserResponse,
  FetchUserRequest,
  FetchUserResponse,
  InviteToSpaceRequest,
  InviteToSpaceResponse,
  OnlineUsersRequest,
  OnlineUsersResponse,
  ProfileRequest,
  ProfileResponse,
  UploadAvatarRequest,
  UploadAvatarResponse,
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

export const uploadAvatar: RequestInterface<UploadAvatarRequest, UploadAvatarResponse> = (
  options
) => {
  const {avatar, headers, ...restOptions} = options;

  const formData: FormData = new FormData();
  formData.append('avatar', avatar);

  const requestParams = {
    headers: {
      'Content-Type': 'multipart/form-data',
      ...headers
    },
    ...restOptions
  };

  const URL = `${userRepositoryEndpoints().avatarUpload}`;
  return request.post(URL, formData, requestParams);
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
