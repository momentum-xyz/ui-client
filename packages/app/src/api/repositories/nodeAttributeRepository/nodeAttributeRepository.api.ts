import {RequestInterface} from '@momentum-xyz/core';

import {request} from 'api/request';

import {nodeAttributesRepositoryEndpoints} from './nodeAttributeRepository.api.endpoints';
import {
  NodeAttributeRequest,
  NodeAttributeResponse,
  NodeAttributeValueRequest
} from './nodeAttributeRepository.api.types';

export const getNodeAttribute: RequestInterface<NodeAttributeRequest, NodeAttributeResponse> = (
  options
) => {
  const {pluginId, attributeName, ...restOptions} = options;

  const requestParams = {
    params: {
      plugin_id: pluginId,
      attribute_name: attributeName
    },
    ...restOptions
  };

  return request.get(nodeAttributesRepositoryEndpoints().base, requestParams);
};

export const setNodeAttribute: RequestInterface<
  NodeAttributeValueRequest,
  NodeAttributeResponse
> = (options) => {
  const {pluginId, attributeName, attributeValue, ...restOptions} = options;

  const requestParams = {
    params: {
      plugin_id: pluginId,
      attribute_name: attributeName
    },
    ...restOptions
  };

  return request.post(nodeAttributesRepositoryEndpoints().base, {attributeValue}, requestParams);
};

export const deleteNodeAttribute: RequestInterface<NodeAttributeRequest, null> = (options) => {
  const {pluginId, attributeName, ...restOptions} = options;

  const requestParams = {
    params: {
      plugin_id: pluginId,
      attribute_name: attributeName
    },
    ...restOptions
  };

  return request.delete(nodeAttributesRepositoryEndpoints().base, requestParams);
};
