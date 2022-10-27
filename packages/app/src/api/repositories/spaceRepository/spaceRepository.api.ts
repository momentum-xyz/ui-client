import {RequestInterface} from '@momentum-xyz/core';
//import {generatePath} from 'react-router-dom';

import {request} from 'api/request';
//import {getSpaceSubAttribute} from 'api/repositories/spaceAttributeRepository';

import {FetchSpaceRequest, FetchSpaceResponse} from './spaceRepository.api.types';

export const fetchSpace: RequestInterface<FetchSpaceRequest, FetchSpaceResponse> = (options) => {
  const {spaceId, ...restOptions} = options;

  // TRANSFORM DATA

  // CALL ANOTHER REPO
  //const x = getSpaceSubAttribute(options, options);

  // TRANSFORM DATA
  //const url = generatePath(spaceOptionRepositoryEndpoints().options, {worldId, spaceId});

  return request.get('', restOptions);
};
