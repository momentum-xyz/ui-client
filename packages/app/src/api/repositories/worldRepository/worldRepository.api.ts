import {RequestInterface} from '@momentum-xyz/core';
import {generatePath} from 'react-router-dom';

import {request} from 'api/request';

import {worldRepositoryEndpoints} from './worldRepository.api.endpoints';
import {
  GetSpaceWithSubSpacesRequest,
  GetSpaceWithSubSpacesResponse,
  SearchSpacesRequest,
  SearchSpacesResponse
} from './worldRepository.api.types';

export const fetchSpaceWithSubSpaces: RequestInterface<
  GetSpaceWithSubSpacesRequest,
  GetSpaceWithSubSpacesResponse
> = (options) => {
  const {worldId, spaceId, ...restOptions} = options;

  restOptions.params = {
    ...restOptions.params,
    space_id: spaceId
  };

  const url = generatePath(worldRepositoryEndpoints().getSpaceWithSubspaces, {worldId});
  return request.get(url, restOptions);
};

export const searchSpaces: RequestInterface<SearchSpacesRequest, SearchSpacesResponse> = (
  options
) => {
  const {worldId, query, ...restOptions} = options;

  restOptions.params = {
    ...restOptions.params,
    query: query
  };

  const url = generatePath(worldRepositoryEndpoints().searchSpaces, {worldId});
  return request.get(url, restOptions);
};
