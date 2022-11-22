import {AttributeNameEnum, PluginIdEnum} from '@momentum-xyz/sdk';

import {RequestInterface} from 'api/interfaces';
import {request} from 'api/request';
import {appVariables} from 'api/constants';

import {
  GetSpaceAttributeItemRequest,
  GetSpaceAttributeResponse,
  SetSpaceAttributeItemRequest,
  SpaceAttributeItemResponse
} from '../spaceAttributeRepository/spaceAttribute.api.types';
import {getSpaceAttributeItem, setSpaceAttributeItem} from '../spaceAttributeRepository';

import {FetchMagicLinkRequest, MagicLinkGenerateRequest} from './magicLinkRepository.api.types';

export const createLink: RequestInterface<MagicLinkGenerateRequest, SpaceAttributeItemResponse> = (
  options
) => {
  const {key, type, data, ...restOptions} = options;

  const attributeOptions: SetSpaceAttributeItemRequest = {
    spaceId: appVariables.NODE_ID,
    plugin_id: PluginIdEnum.CORE,
    attribute_name: AttributeNameEnum.MAGIC_LINKS,
    sub_attribute_key: key,
    value: {type, data},
    ...restOptions
  };

  return setSpaceAttributeItem(attributeOptions, request);
};

export const fetchMagicLink: RequestInterface<FetchMagicLinkRequest, GetSpaceAttributeResponse> = (
  options
) => {
  const {key, ...restOptions} = options;

  const attributeOptions: GetSpaceAttributeItemRequest = {
    spaceId: appVariables.NODE_ID,
    plugin_id: PluginIdEnum.CORE,
    attribute_name: AttributeNameEnum.MAGIC_LINKS,
    sub_attribute_key: key,
    ...restOptions
  };

  return getSpaceAttributeItem(attributeOptions, request);
};
