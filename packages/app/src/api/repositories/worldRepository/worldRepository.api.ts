import {RequestInterface} from '@momentum-xyz/core';
import {generatePath} from 'react-router-dom';

import {request} from 'api/request';

import {worldRepositoryEndpoints} from './worldRepository.api.endpoints';
import {
  GetSpaceWithSubSpacesRequest,
  GetSpaceWithSubSpacesResponse
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
