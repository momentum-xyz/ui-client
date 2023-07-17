import {RequestInterface} from '@momentum-xyz/core';
import {generatePath} from 'react-router-dom';

import {request} from 'api/request';

import {spaceAttributesRepositoryEndpoints} from './spaceAttribute.api.endpoints';
import {
  DeleteSpaceAttributeRequest,
  DeleteSpaceAttributeItemRequest,
  GetSpaceAttributeRequest,
  GetSpaceAttributeResponse,
  GetSpaceAttributeItemRequest,
  SetSpaceAttributeRequest,
  SetSpaceAttributeResponse,
  SetSpaceAttributeItemRequest,
  SpaceAttributeItemResponse
} from './spaceAttribute.api.types';

export const getSpaceAttribute: RequestInterface<
  GetSpaceAttributeRequest,
  GetSpaceAttributeResponse | null
> = (options) => {
  const {spaceId, plugin_id, attribute_name, ...restOptions} = options;

  restOptions.params = {
    plugin_id,
    attribute_name
  };

  const url = generatePath(spaceAttributesRepositoryEndpoints().attributes, {spaceId});

  return request.get(url, restOptions);
};

export const setSpaceAttribute: RequestInterface<
  SetSpaceAttributeRequest,
  SetSpaceAttributeResponse | null
> = (options) => {
  const {spaceId, plugin_id, attribute_name, value, ...restOptions} = options;

  restOptions.params = {
    plugin_id,
    attribute_name
  };

  const url = generatePath(spaceAttributesRepositoryEndpoints().attributes, {spaceId});

  return request.post(
    url,
    {
      plugin_id,
      attribute_name,
      attribute_value: value
    },
    restOptions
  );
};

export const deleteSpaceAttribute: RequestInterface<DeleteSpaceAttributeRequest, null> = (
  options
) => {
  const {spaceId, plugin_id, attribute_name, ...restOptions} = options;

  restOptions.params = {
    plugin_id,
    attribute_name
  };

  const url = generatePath(spaceAttributesRepositoryEndpoints().attributes, {spaceId});

  return request.delete(url, restOptions);
};

export const getSpaceAttributeItem: RequestInterface<
  GetSpaceAttributeItemRequest,
  SpaceAttributeItemResponse
> = (options) => {
  const {spaceId, plugin_id, attribute_name, sub_attribute_key, ...restOptions} = options;

  restOptions.params = {
    plugin_id,
    attribute_name,
    sub_attribute_key
  };

  const url = generatePath(spaceAttributesRepositoryEndpoints().attributeItem, {spaceId});

  return request.get(url, restOptions);
};

export const setSpaceAttributeItem: RequestInterface<
  SetSpaceAttributeItemRequest,
  SpaceAttributeItemResponse
> = (options) => {
  const {spaceId, plugin_id, attribute_name, sub_attribute_key, value, ...restOptions} = options;

  const url = generatePath(spaceAttributesRepositoryEndpoints().attributeItem, {spaceId});

  return request.post(
    url,
    {
      plugin_id,
      attribute_name,
      sub_attribute_key,
      sub_attribute_value: value
    },
    restOptions
  );
};

export const deleteSpaceAttributeItem: RequestInterface<DeleteSpaceAttributeItemRequest, null> = (
  options
) => {
  const {spaceId, plugin_id, attribute_name, sub_attribute_key, ...restOptions} = options;

  const url = generatePath(spaceAttributesRepositoryEndpoints().attributeItem, {spaceId});

  restOptions.data = {
    plugin_id,
    attribute_name,
    sub_attribute_key
  };

  return request.delete(url, restOptions);
};
