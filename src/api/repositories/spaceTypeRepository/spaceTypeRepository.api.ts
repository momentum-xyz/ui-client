import {RequestInterface} from 'api/interfaces';
import {request} from 'api/request';

import {
  ExploreRequest,
  ExploreResponse,
  GetAllowedSpaceTypesRequest,
  GetAllowedSpaceTypesResponse
} from './spaceTypeRepository.api.types';
import {spaceTypeRepositoryEndpoints} from './spaceTypeRepository.api.endpoints';

export const fetchAllowedSpaceTypes: RequestInterface<
  GetAllowedSpaceTypesRequest,
  GetAllowedSpaceTypesResponse
> = (options) => {
  const {spaceId, ...restOptions} = options;
  const url = `${spaceTypeRepositoryEndpoints().allowedTypes}/${spaceId}`;

  return request.get(url, restOptions);
};

export const searchExplore: RequestInterface<ExploreRequest, ExploreResponse> = (options) => {
  const {searchQuery, worldId, spaceId, ...restOptions} = options;

  return request.get(spaceTypeRepositoryEndpoints().explore, {
    ...restOptions,
    params: {
      q: searchQuery,
      worldId,
      spaceId
    }
  });
};
