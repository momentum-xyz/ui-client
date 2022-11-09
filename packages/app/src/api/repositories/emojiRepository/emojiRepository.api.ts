import {RequestInterface} from 'api/interfaces';
import {request} from 'api/request';
import {AttributeNameEnum, PluginIdEnum} from 'api/enums';
import {
  DeleteSpaceSubAttributeRequest,
  DeleteSpaceSubAttributeResponse,
  GetSpaceAttributeRequest,
  GetSpaceAttributeResponse,
  SetSpaceSubAttributeRequest,
  SpaceSubAttributeResponse
} from 'api';
import {
  deleteSpaceSubAttribute,
  getSpaceAttribute,
  setSpaceSubAttribute
} from 'api/repositories/spaceAttributeRepository';

import {
  EmojiDeleteRequest,
  EmojiUploadRequest,
  FetchEmojiRequest,
  EmojiItemInterface
} from './emojiRepository.api.types';

export const createEmoji: RequestInterface<EmojiUploadRequest, SpaceSubAttributeResponse> = (
  options
) => {
  const {key, spaceId, hash, emojiId, name, ...restOptions} = options;

  const emoji: EmojiItemInterface = {
    hash,
    emojiId,
    name
  };

  const attributeOptions: SetSpaceSubAttributeRequest = {
    spaceId: spaceId,
    plugin_id: PluginIdEnum.CORE,
    attribute_name: AttributeNameEnum.EMOJIS,
    sub_attribute_key: key,
    value: emoji,
    ...restOptions
  };

  return setSpaceSubAttribute(attributeOptions, request);
};

export const deleteEmoji: RequestInterface<EmojiDeleteRequest, DeleteSpaceSubAttributeResponse> = (
  options
) => {
  const {key, spaceId, ...restOptions} = options;

  const attributeOptions: DeleteSpaceSubAttributeRequest = {
    spaceId: spaceId,
    plugin_id: PluginIdEnum.CORE,
    attribute_name: AttributeNameEnum.EMOJIS,
    sub_attribute_key: key,
    ...restOptions
  };
  return deleteSpaceSubAttribute(attributeOptions, request);
};

export const fetchEmoji: RequestInterface<FetchEmojiRequest, GetSpaceAttributeResponse> = (
  options
) => {
  const {spaceId, ...restOptions} = options;

  const attributeOptions: GetSpaceAttributeRequest = {
    spaceId: spaceId,
    plugin_id: PluginIdEnum.CORE,
    attribute_name: AttributeNameEnum.EMOJIS,
    ...restOptions
  };
  return getSpaceAttribute(attributeOptions, request);
};
