import {RequestInterface} from '@momentum-xyz/core';

import {request} from 'api/request';

import {pluginsRepositoryEndpoints} from './pluginsRepository.api.endpoints';
import {
  GetPluginsListRequest,
  GetPluginsListResponse,
  GetPluginsMetadataRequest,
  GetPluginsMetadataResponse,
  GetPluginsOptionsRequest,
  GetPluginsOptionsResponse
} from './pluginsRepository.api.types';

export const getPluginsList: RequestInterface<GetPluginsListRequest, GetPluginsListResponse> = (
  options
) => {
  return request.get(pluginsRepositoryEndpoints().list, options);
};

export const getPluginsMetadata: RequestInterface<
  GetPluginsMetadataRequest,
  GetPluginsMetadataResponse
> = (options) => {
  const {plugin_uuids, ...restOptions} = options;

  restOptions.params = {
    plugin_uuids
  };

  return request.get(pluginsRepositoryEndpoints().metadata, restOptions);
};

export const getPluginsOptions: RequestInterface<
  GetPluginsOptionsRequest,
  GetPluginsOptionsResponse
> = (options) => {
  const {plugin_uuids, ...restOptions} = options;

  restOptions.params = {
    plugin_uuids
  };

  return request.get(pluginsRepositoryEndpoints().options, restOptions);
};
