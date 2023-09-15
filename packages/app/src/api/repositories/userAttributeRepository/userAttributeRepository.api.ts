import {RequestInterface} from '@momentum-xyz/core';
import {generatePath} from 'react-router-dom';

import {request} from 'api/request';

import {userAttributesRepositoryEndpoints} from './userAttributeRepository.api.endpoints';
import {
  // CreateOrUpdatePluginUserAttributeValueRequest,
  // CreateOrUpdatePluginUserAttributeValueResponse,
  // DeletePluginUserAttributeValueRequest,
  // DeletePluginUserAttributeValueResponse,
  // GetPluginUserAttributesRequest,
  // GetPluginUserAttributesResponse,
  GetPluginUserAttributeValueRequest,
  GetPluginUserAttributeValueResponse
} from './userAttributeRepository.api.types';

// export const getPluginUserAttributes: RequestInterface<
//   GetPluginUserAttributesRequest,
//   GetPluginUserAttributesResponse
// > = (options) => {
//   const {worldId, userId, pluginId, attributeNames, ...restOptions} = options;

//   const url = generatePath(spaceUserAttributesRepositoryEndpoints().pluginAttributes, {
//     worldId,
//     userId,
//     pluginId
//   });

//   if (attributeNames) {
//     restOptions.data = {
//       attributeNames
//     };
//   }

//   return request.get(url, restOptions);
// };

export const getPluginUserAttributeValue: RequestInterface<
  GetPluginUserAttributeValueRequest,
  GetPluginUserAttributeValueResponse
> = (options) => {
  const {userId, pluginId, attributeName, ...restOptions} = options;

  const requestParams = {
    params: {
      plugin_id: pluginId,
      attribute_name: attributeName
    },
    ...restOptions
  };

  const url = generatePath(userAttributesRepositoryEndpoints().pluginAttributeValue, {
    userId
  });

  return request.get(url, requestParams);
};

// export const createOrUpdatePluginUserAttribute: RequestInterface<
//   CreateOrUpdatePluginUserAttributeValueRequest,
//   CreateOrUpdatePluginUserAttributeValueResponse
// > = (options) => {
//   const {worldId, userId, pluginId, attributeName, value, ...restOptions} = options;

//   const url = generatePath(spaceUserAttributesRepositoryEndpoints().pluginAttributeValue, {
//     worldId,
//     userId,
//     pluginId,
//     attributeName
//   });

//   restOptions.data = value;

//   return request.get(url, restOptions);
// };

// export const deletePluginUserAttribute: RequestInterface<
//   DeletePluginUserAttributeValueRequest,
//   DeletePluginUserAttributeValueResponse
// > = (options) => {
//   const {worldId, userId, pluginId, attributeName, ...restOptions} = options;

//   const url = generatePath(spaceUserAttributesRepositoryEndpoints().pluginAttributeValue, {
//     worldId,
//     userId,
//     pluginId,
//     attributeName
//   });

//   return request.delete(url, restOptions);
// };
