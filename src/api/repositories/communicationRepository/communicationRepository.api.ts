import {RequestInterface} from 'api/interfaces';
import {request} from 'api/request';

import {BaseParticipantRequest, BaseParticipantRespond} from './communicationRepository.api.types';
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
