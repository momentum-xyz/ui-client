import {RequestInterface} from '@momentum-xyz/core';
import {generatePath} from 'react-router-dom';

import {request} from 'api/request';

import {objectUserAttributeRepositoryEndpoints} from './objectUserAttributeRepository.api.endpoints';
import {
  DeleteObjectUserAttributeRequest,
  DeleteObjectUserAttributeResponse,
  DeleteObjectUserSubAttributeRequest,
  GetAllObjectUserAttributeListRequest,
  GetAllObjectUserAttributeListResponse,
  GetAllObjectUserAttributesForObjectRequest,
  GetAllObjectUserAttributesForObjectResponse,
  GetObjectUserAttributeCountRequest,
  GetObjectUserAttributeCountResponse,
  GetObjectUserAttributeRequest,
  GetObjectUserAttributeResponse,
  SetObjectUserAttributeRequest,
  SetObjectUserAttributeResponse,
  SetObjectUserSubAttributeRequest,
  SetObjectUserSubAttributeResponse
} from './objectUserAttributeRepository.api.types';

export const getObjectUserAttribute: RequestInterface<
  GetObjectUserAttributeRequest,
  GetObjectUserAttributeResponse
> = (options) => {
  const {objectId, userId, pluginId, attributeName, ...restOptions} = options;

  const url = generatePath(objectUserAttributeRepositoryEndpoints().attribute, {objectId, userId});

  restOptions.params = {
    plugin_id: pluginId,
    attribute_name: attributeName
  };

  return request.get(url, restOptions);
};

export const setObjectUserAttribute: RequestInterface<
  SetObjectUserAttributeRequest,
  SetObjectUserAttributeResponse
> = (options) => {
  const {objectId, userId, pluginId, attributeName, value, ...restOptions} = options;

  const url = generatePath(objectUserAttributeRepositoryEndpoints().attribute, {objectId, userId});

  return request.post(
    url,
    {
      plugin_id: pluginId,
      attribute_name: attributeName,
      attribute_value: value
    },
    restOptions
  );
};

export const deleteObjectUserAttribute: RequestInterface<
  DeleteObjectUserAttributeRequest,
  DeleteObjectUserAttributeResponse
> = (options) => {
  const {objectId, userId, pluginId, attributeName, ...restOptions} = options;

  const url = generatePath(objectUserAttributeRepositoryEndpoints().attribute, {objectId, userId});

  restOptions.data = {
    plugin_id: pluginId,
    attribute_name: attributeName
  };

  return request.delete(url, restOptions);
};

export const getObjectUserAttributeCount: RequestInterface<
  GetObjectUserAttributeCountRequest,
  GetObjectUserAttributeCountResponse
> = (options) => {
  const {objectId, pluginId, attributeName, ...restOptions} = options;

  const url = generatePath(objectUserAttributeRepositoryEndpoints().attributeCount, {objectId});

  restOptions.params = {
    plugin_id: pluginId,
    attribute_name: attributeName
  };

  return request.get(url, restOptions);
};

export const getAllObjectUserAttributesForObject: RequestInterface<
  GetAllObjectUserAttributesForObjectRequest,
  GetAllObjectUserAttributesForObjectResponse
> = (options) => {
  const {objectId, pluginId, attributeName, ...restOptions} = options;

  const url = generatePath(objectUserAttributeRepositoryEndpoints().allUsers, {objectId});

  restOptions.params = {
    plugin_id: pluginId,
    attribute_name: attributeName
  };

  return request.get(url, restOptions);
};

export const getAllObjectUserAttributeList: RequestInterface<
  GetAllObjectUserAttributeListRequest,
  GetAllObjectUserAttributeListResponse
> = (options) => {
  const {
    objectId,
    pluginId,
    attributeName,
    fields,
    offset,
    order,
    orderDirection,
    filterField,
    filterValue,
    limit = Number.MAX_SAFE_INTEGER,
    q,
    ...restOptions
  } = options;

  const baseUrl = objectUserAttributeRepositoryEndpoints().attributeList;
  const url = generatePath(baseUrl, {objectId, pluginId, attributeName});

  restOptions.params = {
    fields,
    limit,
    offset,
    ...(order && {order: orderDirection === 'DESC' ? `-${order}` : order}),
    ...(q && {q: q})
  };

  if (filterField) {
    restOptions.params[filterField] = filterValue;
  }

  return request.get(url, restOptions);
};

export const setObjectUserSubAttribute: RequestInterface<
  SetObjectUserSubAttributeRequest,
  SetObjectUserSubAttributeResponse
> = (options) => {
  const {
    objectId,
    userId,
    pluginId,
    attributeName,
    sub_attribute_key,
    sub_attribute_value,
    ...restOptions
  } = options;

  const url = generatePath(objectUserAttributeRepositoryEndpoints().subAttribute, {
    objectId,
    userId
  });

  return request.post(
    url,
    {
      plugin_id: pluginId,
      attribute_name: attributeName,
      sub_attribute_key: sub_attribute_key,
      sub_attribute_value: sub_attribute_value
    },
    restOptions
  );
};

export const deleteObjectUserSubAttribute: RequestInterface<
  DeleteObjectUserSubAttributeRequest,
  null
> = (options) => {
  const {objectId, userId, pluginId, attributeName, sub_attribute_key, ...restOptions} = options;

  const url = generatePath(objectUserAttributeRepositoryEndpoints().subAttribute, {
    objectId,
    userId
  });

  restOptions.data = {
    plugin_id: pluginId,
    attribute_name: attributeName,
    sub_attribute_key: sub_attribute_key
  };

  return request.delete(url, restOptions);
};
