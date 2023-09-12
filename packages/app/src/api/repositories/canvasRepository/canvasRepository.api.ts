import {RequestInterface} from '@momentum-xyz/core';
import {generatePath} from 'react-router-dom';

import {request} from 'api/request';

import {canvasRepositoryEndpoints} from './canvasRepository.api.endpoints';
import {
  GetUserContributionsRequest,
  GetUserContributionsResponse
} from './canvasRepository.api.types';

export const getUserContributions: RequestInterface<
  GetUserContributionsRequest,
  GetUserContributionsResponse
> = (options) => {
  const {objectId, ...restOptions} = options;

  const url = generatePath(canvasRepositoryEndpoints().userContributions, {objectId});
  return request.get(url, restOptions);
};
