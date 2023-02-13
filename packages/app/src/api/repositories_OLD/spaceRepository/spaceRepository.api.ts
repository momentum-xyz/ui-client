import {RequestInterface} from 'api/interfaces';
import {request} from 'api/request';

import {spaceRepositoryEndpoints} from './spaceRepository.api.endpoints';
import {
  AddUserRequest,
  AddUserResponse,
  CreateSpaceRequest,
  CreateSpaceResponse,
  OldDeleteSpaceRequest,
  OldDeleteSpaceResponse,
  EditSpaceRequest,
  EditSpaceResponse,
  EditUserRequest,
  EditUserResponse,
  RemoveUserRequest,
  RemoveUserResponse,
  OldSpaceRequest,
  SpaceResponse
} from './spaceRepository.api.types';

export const fetchSpace: RequestInterface<OldSpaceRequest, SpaceResponse> = (options) => {
  const {spaceId, ...restOptions} = options;
  const url = `${spaceRepositoryEndpoints().user}/${spaceId}`;

  return request.get(url, restOptions);
};

export const editSpace: RequestInterface<EditSpaceRequest, EditSpaceResponse> = (options) => {
  const {settings, spaceId, ...restOptions} = options;

  const url = `${spaceRepositoryEndpoints().edit}/${spaceId}`;

  return request.put(url, settings, restOptions);
};

export const deleteSpace: RequestInterface<OldDeleteSpaceRequest, OldDeleteSpaceResponse> = (
  options
) => {
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
  const {space, ...restOptions} = options;

  return request.post(spaceRepositoryEndpoints().create, space, restOptions);
};
