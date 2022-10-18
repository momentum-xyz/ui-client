import {RequestInterface} from 'api/interfaces';
import {request} from 'api/request';

import {
  KickUserRequest,
  KickUserResponse,
  MuteAllUserRequest,
  MuteAllUserResponse,
  MuteUserRequest,
  MuteUserResponse
} from './meetingRepository.api.types';
import {meetingRepositoryEndpoints} from './meetingRepository.api.endpoints';

export const kickUser: RequestInterface<KickUserRequest, KickUserResponse> = (options) => {
  const {spaceId, userId, ...restOptions} = options;
  const url = meetingRepositoryEndpoints().remove(spaceId, userId);

  return request.post(url, restOptions);
};

export const muteUser: RequestInterface<MuteUserRequest, MuteUserResponse> = (options) => {
  const {spaceId, userId, ...restOptions} = options;
  const url = meetingRepositoryEndpoints().mute(spaceId, userId);

  return request.post(url, restOptions);
};

export const muteAllUsers: RequestInterface<MuteAllUserRequest, MuteAllUserResponse> = (
  options
) => {
  const {spaceId, ...restOptions} = options;
  const url = meetingRepositoryEndpoints().muteAll(spaceId);

  return request.post(url, restOptions);
};
