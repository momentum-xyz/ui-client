import {RequestInterface} from '@momentum-xyz/core';
import {AttributeNameEnum} from '@momentum-xyz/sdk';
import {generatePath} from 'react-router-dom';

import {PluginIdEnum} from 'api/enums';
import {request} from 'api/request';
import {GetSpaceAttributeItemRequest, SpaceAttributeItemResponse} from 'api';
import {getSpaceAttributeItem} from 'api/repositories/spaceAttributeRepository';

import {
  ClaimAndCustomizeRequest,
  CleanCustomizationRequest,
  AddWorldMemberRequest,
  DeleteSpaceRequest,
  DeleteWorldMemberRequest,
  FetchSpaceRequest,
  FetchWorldMembersRequest,
  FetchWorldMembersResponse,
  PostSpaceRequest,
  PostSpaceResponse,
  CloneObjectRequest,
  CloneObjectResponse,
  FetchWorldTreeRequest,
  FetchWorldTreeResponse
} from './spaceRepository.api.types';
import {spaceRepositoryEndpoints} from './spaceRepository.api.endpoints';

// TODO: This functionality is still in progress
export const fetchSpace: RequestInterface<FetchSpaceRequest, SpaceAttributeItemResponse> = (
  options
) => {
  const {spaceId, ...restOptions} = options;

  const attributeOptions: GetSpaceAttributeItemRequest = {
    spaceId,
    plugin_id: PluginIdEnum.CORE,
    attribute_name: AttributeNameEnum.NAME,
    sub_attribute_key: AttributeNameEnum.NAME,
    ...restOptions
  };

  return getSpaceAttributeItem(attributeOptions, request);
};

export const postSpace: RequestInterface<PostSpaceRequest, PostSpaceResponse> = (options) => {
  const {
    object_name,
    parent_id,
    object_type_id,
    asset_2d_id,
    asset_3d_id,
    minimap,
    ...restOptions
  } = options;

  return request.post(
    spaceRepositoryEndpoints().base,
    {
      object_name,
      object_type_id,
      parent_id,
      asset_2d_id,
      asset_3d_id,
      minimap
    },
    restOptions
  );
};

export const deleteSpace: RequestInterface<DeleteSpaceRequest, DeleteSpaceRequest> = (options) => {
  const {spaceId, ...restOptions} = options;

  return request.delete(
    generatePath(spaceRepositoryEndpoints().object, {objectId: spaceId}),
    restOptions
  );
};

export const cloneObject: RequestInterface<CloneObjectRequest, CloneObjectResponse> = (options) => {
  const {objectId, ...restOptions} = options;

  return request.post(generatePath(spaceRepositoryEndpoints().clone, {objectId}), {}, restOptions);
};

export const fetchWorldMembers: RequestInterface<
  FetchWorldMembersRequest,
  FetchWorldMembersResponse
> = (options) => {
  const {worldId, ...restOptions} = options;

  return request.get(
    generatePath(spaceRepositoryEndpoints().members, {objectId: worldId}),
    restOptions
  );
};

export const addWorldMember: RequestInterface<AddWorldMemberRequest, null> = (options) => {
  const {worldId, address, role, ...restOptions} = options;

  return request.post(
    generatePath(spaceRepositoryEndpoints().members, {objectId: worldId}),
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
    generatePath(spaceRepositoryEndpoints().deleteMember, {objectId: worldId, userId}),
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

  const url = generatePath(spaceRepositoryEndpoints().tree, {objectId: worldId});
  return request.get(url, restOptions);
};

export const claimAndCustomize: RequestInterface<ClaimAndCustomizeRequest, null> = (options) => {
  const {text, title, image_hash, objectId, ...rest} = options;

  const url = generatePath(spaceRepositoryEndpoints().claimAndCustomize, {objectId});
  return request.post(url, {text, title, image_hash}, rest);
};

export const cleanCustomization: RequestInterface<CleanCustomizationRequest, null> = (options) => {
  const {objectId, ...rest} = options;

  const url = generatePath(spaceRepositoryEndpoints().cleanCustomization, {objectId});
  return request.post(url, {}, rest);
};
