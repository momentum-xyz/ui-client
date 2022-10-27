import {RequestInterface} from '@momentum-xyz/core';

import {request} from 'api/request';
import {GetSpaceSubAttributeRequest, GetSpaceSubAttributeResponse} from 'api';
import {getSpaceSubAttribute} from 'api/repositories/spaceAttributeRepository';

import {FetchSpaceRequest} from './spaceRepository.api.types';

export const fetchSpace: RequestInterface<FetchSpaceRequest, GetSpaceSubAttributeResponse> = (
  options
) => {
  const {spaceId, ...restOptions} = options;

  const attributeOptions: GetSpaceSubAttributeRequest = {
    worldId: '',
    spaceId: '',
    plugin_id: '',
    attribute_name: '',
    sub_attribute_key: '',
    ...restOptions
  };

  return getSpaceSubAttribute(attributeOptions, request);
};
