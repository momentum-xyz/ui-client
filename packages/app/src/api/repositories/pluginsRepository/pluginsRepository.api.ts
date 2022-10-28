import {RequestInterface} from '@momentum-xyz/core';
import {AxiosResponse} from 'axios';

import {appVariables} from 'api/constants';
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
  // const {plugin_uuids, ...restOptions} = options;

  // restOptions.params = {
  //   plugin_uuids
  // };

  // return request.get(pluginsRepositoryEndpoints().metadata, restOptions);

  return (() => {
    const mockResponse: AxiosResponse<GetPluginsMetadataResponse> = {
      data: {
        'ceb9ebad-283c-4b65-9c7e-1b87391e9f49': {
          scriptUrl: appVariables.IS_DEV_ENVIRONMENT
            ? 'http://localhost:3001/remoteEntry.js'
            : 'https://dev2.odyssey.ninja/plugins/miro/remoteEntry.js',
          scopeName: 'momentum_plugin_template',
          name: 'Miro'
        }
      },
      status: 200,
      statusText: 'OK',
      headers: undefined,
      config: options
    };

    return Promise.resolve(mockResponse);
  })();
};

export const getPluginsOptions: RequestInterface<
  GetPluginsOptionsRequest,
  GetPluginsOptionsResponse
> = (options) => {
  // const {plugin_uuids, ...restOptions} = options;

  // restOptions.params = {
  //   plugin_uuids
  // };

  // return request.get(pluginsRepositoryEndpoints().options, restOptions);

  return (() => {
    const mockResponse: AxiosResponse<GetPluginsOptionsResponse> = {
      data: {
        'ceb9ebad-283c-4b65-9c7e-1b87391e9f49': {
          subPath: 'miro',
          iconName: 'miro',
          exact: true
        }
      },
      status: 200,
      statusText: 'OK',
      headers: undefined,
      config: options
    };

    return Promise.resolve(mockResponse);
  })();
};
