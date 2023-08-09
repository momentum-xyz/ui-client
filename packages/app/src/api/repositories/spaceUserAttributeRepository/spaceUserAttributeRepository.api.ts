import {RequestInterface} from '@momentum-xyz/core';
import {generatePath} from 'react-router-dom';

import {request} from 'api/request';

import {spaceUserAttributeRepositoryEndpoints} from './spaceUserAttributeRepository.api.endpoints';
import {
  DeleteSpaceUserAttributeRequest,
  DeleteSpaceUserAttributeResponse,
  DeleteSpaceUserSubAttributeRequest,
  GetAllSpaceUserAttributeListRequest,
  GetAllSpaceUserAttributeListResponse,
  GetAllSpaceUserAttributesForSpaceRequest,
  GetAllSpaceUserAttributesForSpaceResponse,
  GetSpaceUserAttributeCountRequest,
  GetSpaceUserAttributeCountResponse,
  GetSpaceUserAttributeRequest,
  GetSpaceUserAttributeResponse,
  SetSpaceUserAttributeRequest,
  SetSpaceUserAttributeResponse,
  SetSpaceUserSubAttributeRequest,
  SetSpaceUserSubAttributeResponse
} from './spaceUserAttributeRepository.api.types';

export const getSpaceUserAttribute: RequestInterface<
  GetSpaceUserAttributeRequest,
  GetSpaceUserAttributeResponse
> = (options) => {
  const {spaceId, userId, pluginId, attributeName, ...restOptions} = options;

  const url = generatePath(spaceUserAttributeRepositoryEndpoints().attribute, {spaceId, userId});

  restOptions.params = {
    plugin_id: pluginId,
    attribute_name: attributeName
  };

  return request.get(url, restOptions);
};

export const setSpaceUserAttribute: RequestInterface<
  SetSpaceUserAttributeRequest,
  SetSpaceUserAttributeResponse
> = (options) => {
  const {spaceId, userId, pluginId, attributeName, value, ...restOptions} = options;

  const url = generatePath(spaceUserAttributeRepositoryEndpoints().attribute, {spaceId, userId});

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

export const deleteSpaceUserAttribute: RequestInterface<
  DeleteSpaceUserAttributeRequest,
  DeleteSpaceUserAttributeResponse
> = (options) => {
  const {spaceId, userId, pluginId, attributeName, ...restOptions} = options;

  const url = generatePath(spaceUserAttributeRepositoryEndpoints().attribute, {spaceId, userId});

  restOptions.data = {
    plugin_id: pluginId,
    attribute_name: attributeName
  };

  return request.delete(url, restOptions);
};

export const getSpaceUserAttributeCount: RequestInterface<
  GetSpaceUserAttributeCountRequest,
  GetSpaceUserAttributeCountResponse
> = (options) => {
  const {spaceId, pluginId, attributeName, ...restOptions} = options;

  const url = generatePath(spaceUserAttributeRepositoryEndpoints().attributeCount, {spaceId});

  restOptions.params = {
    plugin_id: pluginId,
    attribute_name: attributeName
  };

  return request.get(url, restOptions);
};

export const getAllSpaceUserAttributesForSpace: RequestInterface<
  GetAllSpaceUserAttributesForSpaceRequest,
  GetAllSpaceUserAttributesForSpaceResponse
> = (options) => {
  const {spaceId, pluginId, attributeName, ...restOptions} = options;

  const url = generatePath(spaceUserAttributeRepositoryEndpoints().allUsers, {spaceId});

  restOptions.params = {
    plugin_id: pluginId,
    attribute_name: attributeName
  };

  return request.get(url, restOptions);
};

export const getAllSpaceUserAttributeList: RequestInterface<
  GetAllSpaceUserAttributeListRequest,
  GetAllSpaceUserAttributeListResponse
> = (options) => {
  const {
    spaceId,
    pluginId,
    attributeName,
    fields,
    offset,
    order,
    orderDirection,
    filterField,
    filterValue,
    limit = Number.MAX_SAFE_INTEGER,
    ...restOptions
  } = options;

  const baseUrl = spaceUserAttributeRepositoryEndpoints().attributeList;
  const url = generatePath(baseUrl, {spaceId, pluginId, attributeName});

  restOptions.params = {
    fields,
    limit,
    offset,
    ...(order && {order: orderDirection === 'DESC' ? `-${order}` : order})
  };

  if (filterField) {
    restOptions.params[filterField] = filterValue;
  }

  return request.get(url, restOptions);
};

export const setSpaceUserSubAttribute: RequestInterface<
  SetSpaceUserSubAttributeRequest,
  SetSpaceUserSubAttributeResponse
> = (options) => {
  const {
    spaceId,
    userId,
    pluginId,
    attributeName,
    sub_attribute_key,
    sub_attribute_value,
    ...restOptions
  } = options;

  const url = generatePath(spaceUserAttributeRepositoryEndpoints().subAttribute, {spaceId, userId});

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

export const deleteSpaceUserSubAttribute: RequestInterface<
  DeleteSpaceUserSubAttributeRequest,
  null
> = (options) => {
  const {spaceId, userId, pluginId, attributeName, sub_attribute_key, ...restOptions} = options;

  const url = generatePath(spaceUserAttributeRepositoryEndpoints().subAttribute, {spaceId, userId});

  restOptions.data = {
    plugin_id: pluginId,
    attribute_name: attributeName,
    sub_attribute_key: sub_attribute_key
  };

  return request.delete(url, restOptions);
};
