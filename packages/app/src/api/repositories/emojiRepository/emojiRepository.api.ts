import {AttributeNameEnum} from '@momentum-xyz/sdk';

import {PluginIdEnum} from 'api/enums';
import {RequestInterface} from 'api/interfaces';
import {request} from 'api/request';
import {
  DeleteObjectAttributeItemRequest,
  GetObjectAttributeRequest,
  GetObjectAttributeResponse,
  SetObjectAttributeItemRequest
} from 'api';
import {
  deleteSpaceAttributeItem,
  getObjectAttribute,
  setSpaceAttributeItem
} from 'api/repositories/objectAttributeRepository';

import {
  EmojiDeleteRequest,
  EmojiUploadRequest,
  FetchEmojiRequest,
  EmojiItemInterface
} from './emojiRepository.api.types';

export const createEmoji: RequestInterface<EmojiUploadRequest, GetObjectAttributeResponse> = (
  options
) => {
  const {key, spaceId, hash, emojiId, name, ...restOptions} = options;

  const emoji: EmojiItemInterface = {
    hash,
    emojiId,
    name
  };

  const attributeOptions: SetObjectAttributeItemRequest = {
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

  const attributeOptions: DeleteObjectAttributeItemRequest = {
    spaceId: spaceId,
    plugin_id: PluginIdEnum.CORE,
    attribute_name: AttributeNameEnum.EMOJIS,
    sub_attribute_key: key,
    ...restOptions
  };
  return deleteSpaceAttributeItem(attributeOptions, request);
};

export const fetchEmojis: RequestInterface<FetchEmojiRequest, GetObjectAttributeResponse | null> = (
  options
) => {
  const {spaceId, ...restOptions} = options;

  const attributeOptions: GetObjectAttributeRequest = {
    spaceId: spaceId,
    plugin_id: PluginIdEnum.CORE,
    attribute_name: AttributeNameEnum.EMOJIS,
    ...restOptions
  };
  return getObjectAttribute(attributeOptions, request);
};
