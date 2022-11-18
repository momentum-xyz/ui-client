import {RequestInterface} from '@momentum-xyz/core';
import {generatePath} from 'react-router-dom';

import {request} from 'api/request';

import {spaceOptionRepositoryEndpoints} from './spaceOptionRepository.api.endpoints';
import {
  GetSpaceOptionsRequest,
  GetSpaceOptionsResponse,
  GetSpaceSubOptionRequest,
  SetSpaceSubOptionRequest,
  SpaceSubOptionResponse
} from './spaceOptionRepository.api.types';

export const getSpaceOptions: RequestInterface<GetSpaceOptionsRequest, GetSpaceOptionsResponse> = (
  options
) => {
  const {spaceId, ...restOptions} = options;

  const url = generatePath(spaceOptionRepositoryEndpoints().options, {spaceId});

  return request.get(url, restOptions);
};

export const getSpaceSubOption: RequestInterface<
  GetSpaceSubOptionRequest,
  SpaceSubOptionResponse
> = (options) => {
  const {spaceId, sub_option_key, ...restOptions} = options;

  restOptions.params = {
    sub_option_key
  };

  const url = generatePath(spaceOptionRepositoryEndpoints().subOption, {spaceId});

  return request.get(url, restOptions);
};

export const setSpaceSubOption: RequestInterface<
  SetSpaceSubOptionRequest,
  SpaceSubOptionResponse
> = (options) => {
  const {spaceId, sub_option_key, value, ...restOptions} = options;

  restOptions.params = {
    effective: false
  };

  const url = generatePath(spaceOptionRepositoryEndpoints().subOption, {spaceId});

  return request.post(
    url,
    {
      sub_option_key,
      sub_option_value: value
    },
    restOptions
  );
};
