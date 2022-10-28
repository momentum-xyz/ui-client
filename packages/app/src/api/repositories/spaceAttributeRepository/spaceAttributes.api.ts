import {RequestInterface} from '@momentum-xyz/core';
import {generatePath} from 'react-router-dom';

import {request} from 'api/request';

import {spaceAttributesRepositoryEndpoints} from './spaceAttribute.api.endpoints';
import {
  GetSpaceAttributeRequest,
  GetSpaceAttributeResponse,
  GetSpaceSubAttributeRequest,
  GetSpaceSubAttributeResponse,
  SetSpaceSubAttributeRequest,
  SetSpaceSubAttributeResponse
} from './spaceAttribute.api.types';

export const getSpaceAttribute: RequestInterface<
  GetSpaceAttributeRequest,
  GetSpaceAttributeResponse
> = (options) => {
  const {worldId, spaceId, plugin_id, attribute_name, ...restOptions} = options;

  restOptions.params = {
    plugin_id,
    attribute_name
  };

  const url = generatePath(spaceAttributesRepositoryEndpoints().attributes, {worldId, spaceId});

  return request.get(url, restOptions);
};

export const getSpaceSubAttribute: RequestInterface<
  GetSpaceSubAttributeRequest,
  GetSpaceSubAttributeResponse
> = (options) => {
  const {worldId, spaceId, plugin_id, attribute_name, sub_attribute_key, ...restOptions} = options;

  restOptions.params = {
    plugin_id,
    attribute_name,
    sub_attribute_key
  };

  const url = generatePath(spaceAttributesRepositoryEndpoints().subAttribute, {worldId, spaceId});

  return request.get(url, restOptions);
};

export const setSpaceSubAttribute: RequestInterface<
  SetSpaceSubAttributeRequest,
  SetSpaceSubAttributeResponse
> = (options) => {
  const {worldId, spaceId, plugin_id, attribute_name, sub_attribute_key, value, ...restOptions} =
    options;

  restOptions.params = {
    plugin_id,
    attribute_name,
    sub_attribute_key
  };

  const url = generatePath(spaceAttributesRepositoryEndpoints().subAttribute, {worldId, spaceId});

  return request.post(url, value, restOptions);
};
