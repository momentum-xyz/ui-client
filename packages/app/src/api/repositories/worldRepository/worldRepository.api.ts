import {RequestInterface} from '@momentum-xyz/core';
import {generatePath} from 'react-router-dom';

import {request} from 'api/request';

import {worldRepositoryEndpoints} from './worldRepository.api.endpoints';
import {
  FetchWorldListRequest,
  FetchWorldListResponse,
  FetchWorldRequest,
  FetchWorldResponse,
  PatchWorldRequest,
  PatchWorldResponse
} from './worldRepository.api.types';

export const fetchWorldList: RequestInterface<FetchWorldListRequest, FetchWorldListResponse> = (
  options
) => {
  const {limit, sortDirection, ...restOptions} = options;
  restOptions.params = {sort: sortDirection, limit};
  return request.get(worldRepositoryEndpoints().worldList, restOptions);
};

export const fetchWorld: RequestInterface<FetchWorldRequest, FetchWorldResponse> = (options) => {
  const {worldId, ...restOptions} = options;
  const url = generatePath(worldRepositoryEndpoints().world, {worldId});
  return request.get(url, restOptions);
};

export const patchWorld: RequestInterface<PatchWorldRequest, PatchWorldResponse> = (options) => {
  const {worldId, name, description, website_link, avatarHash, ...rest} = options;
  const data = {name, description, website_link, avatarHash};
  const url = generatePath(worldRepositoryEndpoints().world, {worldId});
  return request.patch(url, data, rest);
};
