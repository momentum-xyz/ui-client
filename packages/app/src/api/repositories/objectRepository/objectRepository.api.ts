import {RequestInterface} from '@momentum-xyz/core';
import {AttributeNameEnum} from '@momentum-xyz/sdk';

import {request} from 'api/request';
import {FetchObjectRequest, GetSpaceAttributeRequest, GetSpaceAttributeResponse} from 'api';
import {getSpaceAttribute} from 'api/repositories/spaceAttributeRepository';

export const fetchObject: RequestInterface<FetchObjectRequest, GetSpaceAttributeResponse | null> = (
  options
) => {
  const {spaceId, pluginId, ...restOptions} = options;

  const attributeOptions: GetSpaceAttributeRequest = {
    spaceId,
    plugin_id: pluginId,
    attribute_name: AttributeNameEnum.STATE,
    ...restOptions
  };

  return getSpaceAttribute(attributeOptions, request);
};
