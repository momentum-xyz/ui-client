import {generatePath} from 'react-router-dom';

import {RequestInterface} from 'api/interfaces';
import {request} from 'api/request';

import {vibeRepositoryEndpoints} from './vibeRepository.api.endpoints';
import {
  VibeCheckRequest,
  VibeCheckResponse,
  VibeCountRequest,
  VibeCountResponse,
  VibeToggleRequest,
  VibeToggleResponse
} from './vibeRepository.api.types';

export const checkVibe: RequestInterface<VibeCheckRequest, VibeCheckResponse> = (options) => {
  const {spaceId, ...restOptions} = options;
  const url = generatePath(vibeRepositoryEndpoints().check, {spaceId});

  return request.get(url, restOptions);
};

export const countVibe: RequestInterface<VibeCountRequest, VibeCountResponse> = (options) => {
  const {spaceId, ...restOptions} = options;
  const url = generatePath(vibeRepositoryEndpoints().count, {spaceId});

  return request.get(url, restOptions);
};

export const toggleVibe: RequestInterface<VibeToggleRequest, VibeToggleResponse> = (options) => {
  const {spaceId, vibeAction, ...restOptions} = options;
  const url = generatePath(vibeRepositoryEndpoints().toggle, {spaceId});

  return request.post(url, {vibeAction}, restOptions);
};
