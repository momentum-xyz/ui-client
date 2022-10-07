import {generatePath} from 'react-router-dom';

import {request} from 'api/request';
import {RequestInterface} from 'api/interfaces';

import {StartFlyWithMeRequest, StopFlyWithMeRequest} from './flyWithMeRepository.api.types';
import {flyWithMeRepositoryEndpoints} from './flyWithMeRepository.api.endpoints';

export const start: RequestInterface<StartFlyWithMeRequest, void> = (options) => {
  const {spaceId, ...restOptions} = options;

  const url = generatePath(flyWithMeRepositoryEndpoints().start, {spaceId});
  return request.post(url, {}, restOptions);
};

export const stop: RequestInterface<StopFlyWithMeRequest, void> = (options) => {
  const {spaceId, ...restOptions} = options;

  const url = generatePath(flyWithMeRepositoryEndpoints().stop, {spaceId});
  return request.post(url, {}, restOptions);
};
