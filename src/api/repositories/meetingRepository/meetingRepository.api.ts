import {RequestInterface} from 'api/interfaces';
import {request} from 'api/request';

import {
  BaseParticipantRequest,
  BaseParticipantRespond,
  ParticipantsMuteRequest
} from './meetingRepository.api.types';
import {meetingRepositoryEndpoints} from './meetingRepository.api.endpoints';

export const kickUser: RequestInterface<BaseParticipantRequest, BaseParticipantRespond> = (
  options
) => {
  const {spaceId, userId, ...restOptions} = options;
  const url = meetingRepositoryEndpoints().remove(spaceId, userId);

  return request.post(url, restOptions);
};

export const muteUser: RequestInterface<BaseParticipantRequest, BaseParticipantRespond> = (
  options
) => {
  const {spaceId, userId, ...restOptions} = options;
  const url = meetingRepositoryEndpoints().mute(spaceId, userId);

  return request.post(url, restOptions);
};

export const muteAllUsers: RequestInterface<ParticipantsMuteRequest, BaseParticipantRespond> = (
  options
) => {
  const {spaceId, ...restOptions} = options;
  const url = meetingRepositoryEndpoints().muteAll(spaceId);

  return request.post(url, restOptions);
};
