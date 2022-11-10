import {RequestInterface} from '@momentum-xyz/core';

import {request} from 'api/request';

import {pluginsRepositoryEndpoints} from './pluginsRepository.api.endpoints';
import {
  GetPluginsListRequest,
  GetPluginsListResponse,
  GetPluginsMetadataRequest,
  GetPluginsMetadataResponse,
  GetPluginsOptionsRequest,
  GetPluginsOptionsResponse,
  SearchPluginsRequest
} from './pluginsRepository.api.types';

export const getPluginsList: RequestInterface<GetPluginsListRequest, GetPluginsListResponse> = (
  options
) => {
  const {ids, type, ...restOptions} = options;

  restOptions.params = {
    ids,
    type
  };

  return request.get(pluginsRepositoryEndpoints().list, restOptions);
};

export const searchPlugins: RequestInterface<SearchPluginsRequest, GetPluginsListResponse> = (
  options
) => {
  const {name, description, type, ...restOptions} = options;

  restOptions.params = {
    name,
    description,
    type
  };

  return request.get(pluginsRepositoryEndpoints().search, restOptions);
};

export const getPluginsMetadata: RequestInterface<
  GetPluginsMetadataRequest,
  GetPluginsMetadataResponse
> = (options) => {
  const {ids, ...restOptions} = options;

  restOptions.params = {
    ids
  };

  return request.get(pluginsRepositoryEndpoints().metadata, restOptions);
};

export const getPluginsOptions: RequestInterface<
  GetPluginsOptionsRequest,
  GetPluginsOptionsResponse
> = (options) => {
  const {ids, ...restOptions} = options;

  restOptions.params = {
    ids
  };

  return request.get(pluginsRepositoryEndpoints().options, restOptions);
};
