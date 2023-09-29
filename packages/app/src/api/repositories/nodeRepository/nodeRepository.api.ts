import {generatePath} from 'react-router-dom';

import {request} from 'api/request';
import {RequestInterface} from 'api/interfaces';

import {
  AddToHostingAllowListRequest,
  GetNodeChallengeRequest,
  GetNodeChallengeResponse,
  RemoveFromHostingAllowListRequest
} from './nodeRepository.api.types';
import {configRepositoryEndpoints} from './nodeRepository.api.endpoints';

export const getNodeChallenge: RequestInterface<
  GetNodeChallengeRequest,
  GetNodeChallengeResponse
> = (options) => {
  return request.post(configRepositoryEndpoints().getChallenge, options);
};

export const addToHostingAllowList: RequestInterface<AddToHostingAllowListRequest, null> = (
  options
) => {
  const {wallet, user_id, ...restOptions} = options;

  return request.post(configRepositoryEndpoints().hostingAllowList, {wallet, user_id}, restOptions);
};

export const removeFromHostingAllowList: RequestInterface<
  RemoveFromHostingAllowListRequest,
  null
> = (options) => {
  const {user_id, ...restOptions} = options;

  return request.delete(
    generatePath(configRepositoryEndpoints().hostingAllowListRemove, {userId: user_id}),
    restOptions
  );
};
