import {RequestInterface} from '@momentum-xyz/core';
import {generatePath} from 'react-router-dom';

import {request} from 'api/request';

import {spaceRepositoryEndpoints} from './spaceRepository.api.endpoints';
import {
  GetSpaceOptionsRequest,
  GetSpaceOptionsResponse,
  GetSpaceSubOptionRequest
} from './spaceRepository.api.types';

export const getSpaceOptions: RequestInterface<GetSpaceOptionsRequest, GetSpaceOptionsResponse> = (
  options
) => {
  const {worldId, spaceId, ...restOptions} = options;

  const url = generatePath(spaceRepositoryEndpoints().options, {worldId, spaceId});

  return request.get(url, restOptions);
};

export const getSpaceSubOption: RequestInterface<GetSpaceSubOptionRequest, unknown> = (options) => {
  const {worldId, spaceId, sub_option_key, ...restOptions} = options;

  restOptions.params = {
    sub_option_key
  };

  return request.get(spaceRepositoryEndpoints().subOption, restOptions);
};
