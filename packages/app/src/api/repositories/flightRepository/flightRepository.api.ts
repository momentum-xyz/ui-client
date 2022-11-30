import {generatePath} from 'react-router-dom';

import {request} from 'api/request';
import {RequestInterface} from 'api/interfaces';

import {flightRepositoryEndpoints} from './flightRepository.api.endpoints';
import {
  FlyToMeRequest,
  StartFlyWithMeRequest,
  StopFlyWithMeRequest
} from './flightRepository.api.types';

export const startFlyWithMe: RequestInterface<StartFlyWithMeRequest, void> = (options) => {
  const {spaceId, ...restOptions} = options;

  const url = generatePath(flightRepositoryEndpoints().startFlyWithMe, {spaceId});
  return request.post(url, {}, restOptions);
};

export const stopFlyWithMe: RequestInterface<StopFlyWithMeRequest, void> = (options) => {
  const {spaceId, ...restOptions} = options;

  const url = generatePath(flightRepositoryEndpoints().stopFlyWithMe, {spaceId});
  return request.post(url, {}, restOptions);
};

export const flyToMe: RequestInterface<FlyToMeRequest, void> = (options) => {
  const {spaceId, ...restOptions} = options;

  const url = generatePath(flightRepositoryEndpoints().flyToMe, {spaceId});
  return request.post(url, {}, restOptions);
};
