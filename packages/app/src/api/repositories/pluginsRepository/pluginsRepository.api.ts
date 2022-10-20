import {RequestInterface} from '@momentum-xyz/core';

import {request} from 'api/request';

import {pluginsRepositoryEndpoints} from './pluginsRepository.api.endpoints';
import {
  GetPluginsMetadataRequest,
  GetPluginsMetadataResponse,
  GetPluginsOptionsRequest,
  GetPluginsOptionsResponse
} from './pluginsRepository.api.types';

export const getPluginsMetadata: RequestInterface<
  GetPluginsMetadataRequest,
  GetPluginsMetadataResponse
> = (options) => {
  const {pluginIds, ...restOptions} = options;

  restOptions.data = {
    pluginIds
  };

  return request.get(pluginsRepositoryEndpoints().metadata, restOptions);
};

export const getPluginsOptions: RequestInterface<
  GetPluginsOptionsRequest,
  GetPluginsOptionsResponse
> = (options) => {
  const {pluginIds, ...restOptions} = options;

  restOptions.data = {
    pluginIds
  };

  return request.get(pluginsRepositoryEndpoints().options, restOptions);
};
