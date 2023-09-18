import {request} from 'api/request';
import {RequestInterface} from 'api/interfaces';

import {GetNodeChallengeRequest, GetNodeChallengeResponse} from './nodeRepository.api.types';
import {configRepositoryEndpoints} from './nodeRepository.api.endpoints';

export const getNodeChallenge: RequestInterface<
  GetNodeChallengeRequest,
  GetNodeChallengeResponse
> = (options) => {
  return request.post(configRepositoryEndpoints().getChallenge, options);
};
