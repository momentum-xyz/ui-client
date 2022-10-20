import {RequestInterface} from '@momentum-xyz/core';
import {generatePath} from 'react-router-dom';

import {request} from 'api/request';

import {spaceAttributesRepositoryEndpoints} from './spaceAttribute.api.endpoints';
import {
  CreateOrUpdatePluginAttributeValueRequest,
  CreateOrUpdatePluginAttributeValueResponse,
  DeletePluginAttributeValueRequest,
  DeletePluginAttributeValueResponse,
  GetPluginAttributesRequest,
  GetPluginAttributesResponse,
  GetPluginAttributeValueRequest,
  GetPluginAttributeValueResponse
} from './spaceAttribute.api.types';

export const getPluginAttributes: RequestInterface<
  GetPluginAttributesRequest,
  GetPluginAttributesResponse
> = (options) => {
  const {worldId, spaceId, pluginId, attributeNames, ...restOptions} = options;

  const url = generatePath(spaceAttributesRepositoryEndpoints().pluginAttributes, {
    worldId,
    spaceId,
    pluginId
  });

  if (attributeNames) {
    restOptions.data = {
      attributeNames
    };
  }

  return request.get(url, restOptions);
};

export const getPluginAttributeValue: RequestInterface<
  GetPluginAttributeValueRequest,
  GetPluginAttributeValueResponse
> = (options) => {
  const {worldId, spaceId, pluginId, attributeName, ...restOptions} = options;

  const url = generatePath(spaceAttributesRepositoryEndpoints().pluginAttributeValue, {
    worldId,
    spaceId,
    pluginId,
    attributeName
  });

  return request.get(url, restOptions);
};

export const createOrUpdatePluginAttribute: RequestInterface<
  CreateOrUpdatePluginAttributeValueRequest,
  CreateOrUpdatePluginAttributeValueResponse
> = (options) => {
  const {worldId, spaceId, pluginId, attributeName, value, ...restOptions} = options;

  const url = generatePath(spaceAttributesRepositoryEndpoints().pluginAttributeValue, {
    worldId,
    spaceId,
    pluginId,
    attributeName
  });

  restOptions.data = value;

  return request.get(url, restOptions);
};

export const deletePluginAttribute: RequestInterface<
  DeletePluginAttributeValueRequest,
  DeletePluginAttributeValueResponse
> = (options) => {
  const {worldId, spaceId, pluginId, attributeName, ...restOptions} = options;

  const url = generatePath(spaceAttributesRepositoryEndpoints().pluginAttributeValue, {
    worldId,
    spaceId,
    pluginId,
    attributeName
  });

  return request.delete(url, restOptions);
};
