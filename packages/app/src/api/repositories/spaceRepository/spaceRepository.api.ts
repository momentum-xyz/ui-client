import {RequestInterface} from '@momentum-xyz/core';
// import {generatePath} from 'react-router-dom';
import {AxiosResponse} from 'axios';

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
  // const {worldId, spaceId, ...restOptions} = options;

  // const url = generatePath(spaceRepositoryEndpoints().options, {worldId, spaceId});

  // return request.get(url, restOptions);

  return (() => {
    const mockResponse: AxiosResponse<GetSpaceOptionsResponse> = {
      data: {
        plugins: ['ceb9ebad-283c-4b65-9c7e-1b87391e9f49']
      },
      status: 200,
      statusText: 'OK',
      headers: undefined,
      config: options
    };

    return Promise.resolve(mockResponse);
  })();
};

export const getSpaceSubOption: RequestInterface<GetSpaceSubOptionRequest, unknown> = (options) => {
  const {worldId, spaceId, sub_option_key, ...restOptions} = options;

  restOptions.params = {
    sub_option_key
  };

  return request.get(spaceRepositoryEndpoints().subOption, restOptions);
};
