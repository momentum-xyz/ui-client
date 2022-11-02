import {RequestInterface} from 'api/interfaces';
import {request} from 'api/request';

import {
  GetSpaceSubAttributeRequest,
  GetSpaceAttributeResponse,
  SetSpaceSubAttributeRequest,
  SpaceSubAttributeResponse
} from '../spaceAttributeRepository/spaceAttribute.api.types';
import {AttributeNameEnum, PluginIdEnum} from '../../enums';
import {getSpaceSubAttribute, setSpaceSubAttribute} from '../spaceAttributeRepository';

import {FetchMagicLinkRequest, MagicLinkGenerateRequest} from './magicLinkRepository.api.types';

export const generateLink: RequestInterface<MagicLinkGenerateRequest, SpaceSubAttributeResponse> = (
  options
) => {
  const {spaceId, type, position, eventId, key, ...restOptions} = options;

  const attributeOptions: SetSpaceSubAttributeRequest = {
    spaceId: spaceId,
    plugin_id: PluginIdEnum.CORE,
    attribute_name: AttributeNameEnum.MAGIC_LINK,
    sub_attribute_key: key,
    value: {position, type, eventId, spaceId},
    ...restOptions
  };

  return setSpaceSubAttribute(attributeOptions, request);
};

export const fetchMagicLink: RequestInterface<FetchMagicLinkRequest, GetSpaceAttributeResponse> = (
  options
) => {
  const {key, worldId, ...restOptions} = options;

  const attributeOptions: GetSpaceSubAttributeRequest = {
    spaceId: worldId,
    plugin_id: PluginIdEnum.CORE,
    attribute_name: AttributeNameEnum.MAGIC_LINK,
    sub_attribute_key: key,
    ...restOptions
  };

  return getSpaceSubAttribute(attributeOptions, request);
};
