import {generatePath} from 'react-router-dom';

import {request} from 'api/request';
import {RequestInterface} from 'api/interfaces';

import {flightRepositoryEndpoints} from './flightRepository.api.endpoints';
import {FlyToMeRequest} from './flightRepository.api.types';

export const flyToMe: RequestInterface<FlyToMeRequest, void> = (options) => {
  const {spaceId, ...restOptions} = options;

  const url = generatePath(flightRepositoryEndpoints().flyToMe, {spaceId});
  return request.post(url, {}, restOptions);
};
