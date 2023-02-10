import {request} from 'api/request';
import {RequestInterface} from 'api/interfaces';

import {
  InviteToSpaceRequest,
  InviteToSpaceResponse,
  ProfileRequest,
  ProfileResponse,
  UserSearchRequest,
  UserSearchResponse
} from './userRepository.api.types';
import {userRepositoryEndpoints} from './userRepository.api.endpoints';

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
