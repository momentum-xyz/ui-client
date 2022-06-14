import {RequestInterface} from 'api/interfaces';
import {request} from 'api/request';

import {
  BaseParticipantRequest,
  BaseParticipantRespond,
  ParticipantsMuteRequest
} from './communicationRepository.api.types';
import {communicationRepositoryEndpoints} from './communicationRepository.api.endpoints';

export const removeParticipant: RequestInterface<BaseParticipantRequest, BaseParticipantRespond> = (
  options
) => {
  const {spaceId, userId, ...restOptions} = options;
  const url = communicationRepositoryEndpoints().remove(spaceId, userId);

  return request.post(url, restOptions);
};

export const muteParticipant: RequestInterface<BaseParticipantRequest, BaseParticipantRespond> = (
  options
) => {
  const {spaceId, userId, ...restOptions} = options;
  const url = communicationRepositoryEndpoints().mute(spaceId, userId);

  return request.post(url, restOptions);
};

export const muteAllParticipants: RequestInterface<
  ParticipantsMuteRequest,
  BaseParticipantRespond
> = (options) => {
  const {spaceId, ...restOptions} = options;
  const url = communicationRepositoryEndpoints().muteAll(spaceId);

  return request.post(url, restOptions);
};
