import {RequestInterface} from '@momentum-xyz/core';
import {generatePath} from 'react-router-dom';

import {request} from 'api/request';

import {spaceRepositoryEndpoints} from './spaceRepository.api.endpoints';
import {
  GetSpaceAncestorsRequest,
  GetSpaceAncestorsResponse,
  GetSpacePluginListRequest,
  GetSpacePluginListResponse,
  GetSpaceRequest,
  GetSpaceResponse,
  InviteUserRequest,
  InviteUserResponse,
  SearchSpacesRequest,
  SearchSpacesResponse
} from './spaceRepository.api.types';

export const getSpace: RequestInterface<GetSpaceRequest, GetSpaceResponse> = (options) => {
  const {worldId, spaceId, ...restOptions} = options;

  const url = generatePath(spaceRepositoryEndpoints().base, {worldId, spaceId});

  return request.get(url, restOptions);
};

export const getSpaceAncestors: RequestInterface<
  GetSpaceAncestorsRequest,
  GetSpaceAncestorsResponse
> = (options) => {
  const {worldId, spaceId, ...restOptions} = options;

  const url = generatePath(spaceRepositoryEndpoints().ancestors, {worldId, spaceId});

  return request.get(url, restOptions);
};

export const searchSpaces: RequestInterface<SearchSpacesRequest, SearchSpacesResponse> = (
  options
) => {
  const {worldId, spaceId, q, ...restOptions} = options;

  const url = generatePath(spaceRepositoryEndpoints().base, {worldId, spaceId});

  restOptions.params = {
    q
  };

  return request.get(url, restOptions);
};

export const inviteUser: RequestInterface<InviteUserRequest, InviteUserResponse> = (options) => {
  const {worldId, spaceId, userId, ...restOptions} = options;

  const url = generatePath(spaceRepositoryEndpoints().base, {worldId, spaceId, userId});

  return request.get(url, restOptions);
};

export const getSpacePluginList: RequestInterface<
  GetSpacePluginListRequest,
  GetSpacePluginListResponse
> = (options) => {
  const {worldId, spaceId, ...restOptions} = options;

  const url = generatePath(spaceRepositoryEndpoints().plugins, {worldId, spaceId});

  return request.get(url, restOptions);
};
