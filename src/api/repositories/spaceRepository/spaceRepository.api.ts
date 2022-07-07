import {AxiosRequestConfig} from 'axios';
import {generatePath} from 'react-router-dom';

import {RequestInterface} from 'api/interfaces';
import {request} from 'api/request';

import {
  AddUserRequest,
  AddUserResponse,
  CreateInitiativeRequest,
  CreateInitiativeResponse,
  CreateSpaceRequest,
  CreateSpaceResponse,
  DeleteSpaceRequest,
  DeleteSpaceResponse,
  EditSpaceRequest,
  EditSpaceResponse,
  EditUserRequest,
  EditUserResponse,
  RemoveUserRequest,
  RemoveUserResponse,
  SearchSpacesRequest,
  SearchSpacesResponse,
  SpaceRequest,
  SpaceResponse,
  UserOwnedSpacesRequest,
  UserOwnedSpacesResponse,
  UserSpaceListRequest,
  UserSpaceListItemResponse,
  WorldConfigRequest,
  WorldConfigResponse
} from './spaceRepository.api.types';
import {spaceRepositoryEndpoints} from './spaceRepository.api.endpoints';

export const fetchSpace: RequestInterface<SpaceRequest, SpaceResponse> = (options) => {
  const {spaceId, ...restOptions} = options;
  const url = `${spaceRepositoryEndpoints().user}/${spaceId}`;

  return request.get(url, restOptions);
};

export const editSpace: RequestInterface<EditSpaceRequest, EditSpaceResponse> = (options) => {
  const {settings, spaceId, ...restOptions} = options;

  const url = `${spaceRepositoryEndpoints().edit}/${spaceId}`;

  return request.put(url, settings, restOptions);
};

export const deleteSpace: RequestInterface<DeleteSpaceRequest, DeleteSpaceResponse> = (options) => {
  const {spaceId, ...restOptions} = options;

  const url = `${spaceRepositoryEndpoints().delete}/${spaceId}`;

  return request.delete(url, restOptions);
};

export const removeUser: RequestInterface<RemoveUserRequest, RemoveUserResponse> = (options) => {
  const {user, ...restOptions} = options;

  return request.post(spaceRepositoryEndpoints().unassignUser, user, restOptions);
};

export const editUser: RequestInterface<EditUserRequest, EditUserResponse> = (options) => {
  const {user, ...restOptions} = options;

  return request.post(spaceRepositoryEndpoints().assignUser, user, restOptions);
};

export const addUser: RequestInterface<AddUserRequest, AddUserResponse> = (options) => {
  const {user, ...restOptions} = options;

  return request.post(spaceRepositoryEndpoints().assignUser, user, restOptions);
};

export const create: RequestInterface<CreateSpaceRequest, CreateSpaceResponse> = (options) => {
  const {newSpace, ...restOptions} = options;

  return request.post(spaceRepositoryEndpoints().create, newSpace, restOptions);
};

export const fetchUserOwnedSpaces: RequestInterface<
  UserOwnedSpacesRequest,
  UserOwnedSpacesResponse
> = (options) => {
  const {worldId, ...restOptions} = options;

  const config: AxiosRequestConfig = {
    ...restOptions,
    params: {
      world: worldId
    }
  };

  return request.get(spaceRepositoryEndpoints().ownedSpaces, config);
};

export const fetchUserSpaceList: RequestInterface<
  UserSpaceListRequest,
  UserSpaceListItemResponse[]
> = (options) => {
  const {userId, ...restOptions} = options;
  const url = generatePath(spaceRepositoryEndpoints().userSpaceList, {userId});
  return request.get(url, restOptions);
};

export const createInitiative: RequestInterface<
  CreateInitiativeRequest,
  CreateInitiativeResponse
> = (options) => {
  const {initiative, ...restOptions} = options;
  return request.post(spaceRepositoryEndpoints().createInitiative, initiative, restOptions);
};

export const searchSpaces: RequestInterface<SearchSpacesRequest, SearchSpacesResponse> = (
  options
) => {
  const {q, worldId, ...restOptions} = options;

  restOptions.params = {
    q,
    worldId
  };

  return request.get(spaceRepositoryEndpoints().search, restOptions);
};

export const fetchWorldConfig: RequestInterface<WorldConfigRequest, WorldConfigResponse> = (
  options
) => {
  const {worldId, ...restOptions} = options;

  const url = generatePath(spaceRepositoryEndpoints().worldConfig, {worldId});

  return request.get(url, restOptions);
};
