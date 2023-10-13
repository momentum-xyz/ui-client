import {RequestInterface} from '@momentum-xyz/core';
import {generatePath} from 'react-router-dom';

import {request} from 'api/request';
import {SpawnByUserRequest, SpawnByUserResponse} from 'api';

import {objectRepositoryEndpoints} from './objectRepository.api.endpoints';
import {
  ClaimAndCustomizeRequest,
  CleanCustomizationRequest,
  AddWorldMemberRequest,
  DeleteObjectRequest,
  DeleteWorldMemberRequest,
  FetchWorldMembersRequest,
  FetchWorldMembersResponse,
  CreateObjectRequest,
  CreateObjectResponse,
  CloneObjectRequest,
  CloneObjectResponse,
  FetchWorldTreeRequest,
  FetchWorldTreeResponse
} from './objectRepository.api.types';

export const createObject: RequestInterface<CreateObjectRequest, CreateObjectResponse> = (
  options
) => {
  const {
    object_name,
    parent_id,
    object_type_id,
    asset_2d_id,
    asset_3d_id,
    transform,
    minimap,
    ...restOptions
  } = options;

  return request.post(
    objectRepositoryEndpoints().base,
    {
      object_name,
      object_type_id,
      parent_id,
      asset_2d_id,
      asset_3d_id,
      transform,
      minimap
    },
    restOptions
  );
};

export const deleteObject: RequestInterface<DeleteObjectRequest, null> = (options) => {
  const {objectId, ...restOptions} = options;

  return request.delete(generatePath(objectRepositoryEndpoints().object, {objectId}), restOptions);
};

export const cloneObject: RequestInterface<CloneObjectRequest, CloneObjectResponse> = (options) => {
  const {objectId, ...restOptions} = options;

  return request.post(generatePath(objectRepositoryEndpoints().clone, {objectId}), {}, restOptions);
};

export const fetchWorldMembers: RequestInterface<
  FetchWorldMembersRequest,
  FetchWorldMembersResponse
> = (options) => {
  const {worldId, ...restOptions} = options;

  return request.get(
    generatePath(objectRepositoryEndpoints().members, {objectId: worldId}),
    restOptions
  );
};

export const addWorldMember: RequestInterface<AddWorldMemberRequest, null> = (options) => {
  const {worldId, address, role, ...restOptions} = options;

  return request.post(
    generatePath(objectRepositoryEndpoints().members, {objectId: worldId}),
    {
      wallet: address,
      role
    },
    restOptions
  );
};

export const deleteWorldMember: RequestInterface<DeleteWorldMemberRequest, null> = (options) => {
  const {worldId, userId, ...restOptions} = options;

  return request.delete(
    generatePath(objectRepositoryEndpoints().deleteMember, {objectId: worldId, userId}),
    restOptions
  );
};

export const fetchWorldTree: RequestInterface<FetchWorldTreeRequest, FetchWorldTreeResponse> = (
  options
) => {
  const {worldId, max_depth, object_type, ...restOptions} = options;

  restOptions.params = {
    max_depth,
    object_type
  };

  const url = generatePath(objectRepositoryEndpoints().tree, {objectId: worldId});
  return request.get(url, restOptions);
};

export const claimAndCustomize: RequestInterface<ClaimAndCustomizeRequest, null> = (options) => {
  const {text, title, image_hash, objectId, ...rest} = options;

  const url = generatePath(objectRepositoryEndpoints().claimAndCustomize, {objectId});
  return request.post(url, {text, title, image_hash}, rest);
};

export const cleanCustomization: RequestInterface<CleanCustomizationRequest, null> = (options) => {
  const {objectId, ...rest} = options;

  const url = generatePath(objectRepositoryEndpoints().cleanCustomization, {objectId});
  return request.post(url, {}, rest);
};

export const spawnByUser: RequestInterface<SpawnByUserRequest, SpawnByUserResponse> = (options) => {
  const {objectId, object_name, object_type_id, attributes, ...rest} = options;

  const url = generatePath(objectRepositoryEndpoints().spawnByUser, {objectId});
  return request.post(url, {object_name, object_type_id, attributes}, rest);
};
