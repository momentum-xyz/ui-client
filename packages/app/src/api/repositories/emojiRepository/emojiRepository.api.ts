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
  deleteObjectAttributeItem,
  getObjectAttribute,
  setObjectAttributeItem
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
  const {key, objectId, hash, emojiId, name, ...restOptions} = options;

  const emoji: EmojiItemInterface = {
    hash,
    emojiId,
    name
  };

  const attributeOptions: SetObjectAttributeItemRequest = {
    objectId,
    plugin_id: PluginIdEnum.CORE,
    attribute_name: AttributeNameEnum.EMOJIS,
    sub_attribute_key: key,
    value: emoji,
    ...restOptions
  };

  return setObjectAttributeItem(attributeOptions, request);
};

export const deleteEmoji: RequestInterface<EmojiDeleteRequest, null> = (options) => {
  const {key, objectId, ...restOptions} = options;

  const attributeOptions: DeleteObjectAttributeItemRequest = {
    objectId,
    plugin_id: PluginIdEnum.CORE,
    attribute_name: AttributeNameEnum.EMOJIS,
    sub_attribute_key: key,
    ...restOptions
  };
  return deleteObjectAttributeItem(attributeOptions, request);
};

export const fetchEmojis: RequestInterface<FetchEmojiRequest, GetObjectAttributeResponse | null> = (
  options
) => {
  const {objectId, ...restOptions} = options;

  const attributeOptions: GetObjectAttributeRequest = {
    objectId,
    plugin_id: PluginIdEnum.CORE,
    attribute_name: AttributeNameEnum.EMOJIS,
    ...restOptions
  };
  return getObjectAttribute(attributeOptions, request);
};
