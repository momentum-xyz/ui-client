import {RequestInterface} from '@momentum-xyz/core';

import {request} from 'api/request';
import {AttributeNameEnum, PluginIdEnum} from 'api/enums';
import {GetSpaceSubAttributeRequest, SpaceSubAttributeResponse} from 'api';
import {getSpaceSubAttribute} from 'api/repositories/spaceAttributeRepository';

import {FetchSpaceRequest} from './spaceRepository.api.types';

// TODO: This functionality is still in progress
export const fetchSpace: RequestInterface<FetchSpaceRequest, SpaceSubAttributeResponse> = (
  options
) => {
  const {spaceId, ...restOptions} = options;

  const attributeOptions: GetSpaceSubAttributeRequest = {
    spaceId,
    plugin_id: PluginIdEnum.CORE,
    attribute_name: AttributeNameEnum.NAME,
    sub_attribute_key: AttributeNameEnum.NAME,
    ...restOptions
  };

  return getSpaceSubAttribute(attributeOptions, request);
};
