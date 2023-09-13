import {RequestInterface} from '@momentum-xyz/core';
import {generatePath} from 'react-router-dom';

import {request} from 'api/request';

import {objectAttributesRepositoryEndpoints} from './objectAttribute.api.endpoints';
import {
  DeleteObjectAttributeRequest,
  DeleteObjectAttributeItemRequest,
  GetObjectAttributeRequest,
  GetObjectAttributeResponse,
  GetObjectAttributeItemRequest,
  SetObjectAttributeRequest,
  SetObjectAttributeResponse,
  SetObjectAttributeItemRequest,
  ObjectAttributeItemResponse
} from './objectAttribute.api.types';

export const getObjectAttribute: RequestInterface<
  GetObjectAttributeRequest,
  GetObjectAttributeResponse | null
> = (options) => {
  const {spaceId, plugin_id, attribute_name, ...restOptions} = options;

  restOptions.params = {
    plugin_id,
    attribute_name
  };

  const url = generatePath(objectAttributesRepositoryEndpoints().attributes, {spaceId});

  return request.get(url, restOptions);
};

export const setSpaceAttribute: RequestInterface<
  SetObjectAttributeRequest,
  SetObjectAttributeResponse | null
> = (options) => {
  const {spaceId, plugin_id, attribute_name, value, ...restOptions} = options;

  restOptions.params = {
    plugin_id,
    attribute_name
  };

  const url = generatePath(objectAttributesRepositoryEndpoints().attributes, {spaceId});

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

export const deleteSpaceAttribute: RequestInterface<DeleteObjectAttributeRequest, null> = (
  options
) => {
  const {spaceId, plugin_id, attribute_name, ...restOptions} = options;

  restOptions.params = {
    plugin_id,
    attribute_name
  };

  const url = generatePath(objectAttributesRepositoryEndpoints().attributes, {spaceId});

  return request.delete(url, restOptions);
};

export const getSpaceAttributeItem: RequestInterface<
  GetObjectAttributeItemRequest,
  ObjectAttributeItemResponse
> = (options) => {
  const {spaceId, plugin_id, attribute_name, sub_attribute_key, ...restOptions} = options;

  restOptions.params = {
    plugin_id,
    attribute_name,
    sub_attribute_key
  };

  const url = generatePath(objectAttributesRepositoryEndpoints().attributeItem, {spaceId});

  return request.get(url, restOptions);
};

export const setSpaceAttributeItem: RequestInterface<
  SetObjectAttributeItemRequest,
  ObjectAttributeItemResponse
> = (options) => {
  const {spaceId, plugin_id, attribute_name, sub_attribute_key, value, ...restOptions} = options;

  const url = generatePath(objectAttributesRepositoryEndpoints().attributeItem, {spaceId});

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

export const deleteSpaceAttributeItem: RequestInterface<DeleteObjectAttributeItemRequest, null> = (
  options
) => {
  const {spaceId, plugin_id, attribute_name, sub_attribute_key, ...restOptions} = options;

  const url = generatePath(objectAttributesRepositoryEndpoints().attributeItem, {spaceId});

  restOptions.data = {
    plugin_id,
    attribute_name,
    sub_attribute_key
  };

  return request.delete(url, restOptions);
};
