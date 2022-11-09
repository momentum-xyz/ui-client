import {RequestInterface} from 'api/interfaces';
import {request} from 'api/request';
import {AttributeNameEnum, PluginIdEnum} from 'api/enums';
import {
  DeleteSpaceSubAttributeRequest,
  GetSpaceAttributeRequest,
  GetSpaceAttributeResponse,
  SetSpaceSubAttributeRequest
} from 'api';
import {
  deleteSpaceAttributeItem,
  getSpaceAttribute,
  setSpaceAttributeItem
} from 'api/repositories/spaceAttributeRepository';

import {
  EmojiDeleteRequest,
  EmojiUploadRequest,
  FetchEmojiRequest,
  EmojiItemInterface
} from './emojiRepository.api.types';

export const createEmoji: RequestInterface<EmojiUploadRequest, GetSpaceAttributeResponse> = (
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

  return setSpaceAttributeItem(attributeOptions, request);
};

export const deleteEmoji: RequestInterface<EmojiDeleteRequest, null> = (options) => {
  const {key, spaceId, ...restOptions} = options;

  const attributeOptions: DeleteSpaceSubAttributeRequest = {
    spaceId: spaceId,
    plugin_id: PluginIdEnum.CORE,
    attribute_name: AttributeNameEnum.EMOJIS,
    sub_attribute_key: key,
    ...restOptions
  };
  return deleteSpaceAttributeItem(attributeOptions, request);
};

export const fetchEmojis: RequestInterface<FetchEmojiRequest, GetSpaceAttributeResponse | null> = (
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
