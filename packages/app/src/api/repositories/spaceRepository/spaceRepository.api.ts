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

import {FetchSpaceRequest} from './spaceRepository.api.types';
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
