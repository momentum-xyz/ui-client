import {RequestInterface} from '@momentum-xyz/core';
import {generatePath} from 'react-router-dom';

import {request} from 'api/request';

import {spaceUserAttributeRepositoryEndpoints} from './spaceUserAttributeRepository.api.endpoints';
import {
  DeleteSpaceUserAttributeRequest,
  DeleteSpaceUserAttributeResponse,
  GetAllSpaceUserAttributesForSpaceRequest,
  GetAllSpaceUserAttributesForSpaceResponse,
  GetSpaceUserAttributeCountRequest,
  GetSpaceUserAttributeCountResponse,
  GetSpaceUserAttributeRequest,
  GetSpaceUserAttributeResponse,
  SetSpaceUserAttributeRequest,
  SetSpaceUserAttributeResponse
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
  const {spaceId, userId, pluginId, attributeName, sinceDateIsoUtc, ...restOptions} = options;

  const url = generatePath(spaceUserAttributeRepositoryEndpoints().attributeCount, {
    spaceId,
    userId,
    pluginId,
    attributeName
  });

  if (sinceDateIsoUtc) {
    restOptions.params = {
      since: sinceDateIsoUtc
    };
  }

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
