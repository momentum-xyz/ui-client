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
  const {objectId, plugin_id, attribute_name, ...restOptions} = options;

  restOptions.params = {
    plugin_id,
    attribute_name
  };

  const url = generatePath(objectAttributesRepositoryEndpoints().attributes, {objectId});

  return request.get(url, restOptions);
};

export const setObjectAttribute: RequestInterface<
  SetObjectAttributeRequest,
  SetObjectAttributeResponse | null
> = (options) => {
  const {objectId, plugin_id, attribute_name, value, ...restOptions} = options;

  restOptions.params = {
    plugin_id,
    attribute_name
  };

  const url = generatePath(objectAttributesRepositoryEndpoints().attributes, {objectId});

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

export const deleteObjectAttribute: RequestInterface<DeleteObjectAttributeRequest, null> = (
  options
) => {
  const {objectId, plugin_id, attribute_name, ...restOptions} = options;

  restOptions.params = {
    plugin_id,
    attribute_name
  };

  const url = generatePath(objectAttributesRepositoryEndpoints().attributes, {objectId});

  return request.delete(url, restOptions);
};

export const getObjectAttributeItem: RequestInterface<
  GetObjectAttributeItemRequest,
  ObjectAttributeItemResponse
> = (options) => {
  const {objectId, plugin_id, attribute_name, sub_attribute_key, ...restOptions} = options;

  restOptions.params = {
    plugin_id,
    attribute_name,
    sub_attribute_key
  };

  const url = generatePath(objectAttributesRepositoryEndpoints().attributeItem, {objectId});

  return request.get(url, restOptions);
};

export const setObjectAttributeItem: RequestInterface<
  SetObjectAttributeItemRequest,
  ObjectAttributeItemResponse
> = (options) => {
  const {objectId, plugin_id, attribute_name, sub_attribute_key, value, ...restOptions} = options;

  const url = generatePath(objectAttributesRepositoryEndpoints().attributeItem, {objectId});

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

export const deleteObjectAttributeItem: RequestInterface<DeleteObjectAttributeItemRequest, null> = (
  options
) => {
  const {objectId, plugin_id, attribute_name, sub_attribute_key, ...restOptions} = options;

  const url = generatePath(objectAttributesRepositoryEndpoints().attributeItem, {objectId});

  restOptions.data = {
    plugin_id,
    attribute_name,
    sub_attribute_key
  };

  return request.delete(url, restOptions);
};
