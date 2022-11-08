import {EmojiItemInterface} from 'core/interfaces';

export interface EmojiUploadRequest {
  key: string;
  spaceId: string;
  name: string;
  hash: string;
  emojiId: string;
}

export interface EmojiUploadResponse extends EmojiItemInterface {}

export interface EmojiDeleteRequest {
  key: string;
  spaceId: string;
}

export interface EmojiDeleteResponse {}

export interface FetchEmojiRequest {
  spaceId: string;
}

export interface FetchEmojiResponse extends EmojiItemInterface {}
