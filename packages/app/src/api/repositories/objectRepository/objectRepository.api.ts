import {RequestInterface} from '@momentum-xyz/core';
import {AttributeNameEnum} from '@momentum-xyz/sdk';

import {request} from 'api/request';
import {FetchObjectRequest, GetObjectAttributeRequest, GetObjectAttributeResponse} from 'api';
import {getObjectAttribute} from 'api/repositories/objectAttributeRepository';

export const fetchObject: RequestInterface<
  FetchObjectRequest,
  GetObjectAttributeResponse | null
> = (options) => {
  const {spaceId, pluginId, ...restOptions} = options;

  const attributeOptions: GetObjectAttributeRequest = {
    spaceId,
    plugin_id: pluginId,
    attribute_name: AttributeNameEnum.STATE,
    ...restOptions
  };

  return getObjectAttribute(attributeOptions, request);
};
