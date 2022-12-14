import {RequestInterface} from '@momentum-xyz/core';
import {AttributeNameEnum} from '@momentum-xyz/sdk';
import {generatePath} from 'react-router-dom';

import {PluginIdEnum} from 'api/enums';
import {request} from 'api/request';
import {
  GetDocksCountRequest,
  GetDocksCountResponse,
  GetSpaceAttributeItemRequest,
  SpaceAttributeItemResponse
} from 'api';
import {getSpaceAttributeItem} from 'api/repositories/spaceAttributeRepository';

import {
  DeleteSpaceRequest,
  FetchSpaceRequest,
  PostSpaceRequest,
  PostSpaceResponse
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

export const fetchDocksCount: RequestInterface<GetDocksCountRequest, GetDocksCountResponse> = (
  options
) => {
  const {spaceId, ...restOptions} = options;

  const url = generatePath(spaceRepositoryEndpoints().docks, {spaceId});
  return request.get(url, restOptions);
};

export const postSpace: RequestInterface<PostSpaceRequest, PostSpaceResponse> = (options) => {
  const {space_name, parent_id, space_type_id, asset_2d_id, asset_3d_id, ...restOptions} = options;

  return request.post(
    spaceRepositoryEndpoints().base,
    {
      space_name,
      space_type_id,
      parent_id,
      asset_2d_id,
      asset_3d_id
    },
    restOptions
  );
};

export const deleteSpace: RequestInterface<DeleteSpaceRequest, DeleteSpaceRequest> = (options) => {
  const {spaceId, ...restOptions} = options;

  return request.delete(generatePath(spaceRepositoryEndpoints().space, {spaceId}), restOptions);
};
