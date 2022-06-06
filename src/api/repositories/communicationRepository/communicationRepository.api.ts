import {RequestInterface} from 'api/interfaces';
import {request} from 'api/request';

import {
  RemoveParticipantRequest,
  RemoveParticipantRespond
} from './communicationRepository.api.types';
import {communicationRepositoryEndpoints} from './communicationRepository.api.endpoints';

export const removeParticipant: RequestInterface<
  RemoveParticipantRequest,
  RemoveParticipantRespond
> = (options) => {
  const {spaceId, userId, ...restOptions} = options;
  console.info(spaceId, userId, restOptions);
  const url = communicationRepositoryEndpoints().remove(spaceId, userId);

  return request.post(url, restOptions);
};
