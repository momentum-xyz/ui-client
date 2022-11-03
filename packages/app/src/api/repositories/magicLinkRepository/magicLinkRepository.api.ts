import {RequestInterface} from 'api/interfaces';
import {request} from 'api/request';
import {appVariables} from 'api/constants';
import {AttributeNameEnum, PluginIdEnum} from 'api/enums';

import {
  GetSpaceSubAttributeRequest,
  GetSpaceAttributeResponse,
  SetSpaceSubAttributeRequest,
  SpaceSubAttributeResponse
} from '../spaceAttributeRepository/spaceAttribute.api.types';
import {getSpaceSubAttribute, setSpaceSubAttribute} from '../spaceAttributeRepository';

import {FetchMagicLinkRequest, MagicLinkGenerateRequest} from './magicLinkRepository.api.types';

export const createLink: RequestInterface<MagicLinkGenerateRequest, SpaceSubAttributeResponse> = (
  options
) => {
  const {key, type, data, ...restOptions} = options;

  const attributeOptions: SetSpaceSubAttributeRequest = {
    spaceId: appVariables.NODE_ID,
    plugin_id: PluginIdEnum.CORE,
    attribute_name: AttributeNameEnum.MAGIC_LINKS,
    sub_attribute_key: key,
    value: {type, data},
    ...restOptions
  };

  return setSpaceSubAttribute(attributeOptions, request);
};

export const fetchMagicLink: RequestInterface<FetchMagicLinkRequest, GetSpaceAttributeResponse> = (
  options
) => {
  const {key, ...restOptions} = options;

  const attributeOptions: GetSpaceSubAttributeRequest = {
    spaceId: appVariables.NODE_ID,
    plugin_id: PluginIdEnum.CORE,
    attribute_name: AttributeNameEnum.MAGIC_LINKS,
    sub_attribute_key: key,
    ...restOptions
  };

  return getSpaceSubAttribute(attributeOptions, request);
};
