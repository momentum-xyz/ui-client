export interface EmojiUploadRequest {
  key: string;
  spaceId: string;
  name: string;
  hash: string;
  emojiId: string;
}

export interface EmojiDeleteRequest {
  key: string;
  spaceId: string;
}

export interface FetchEmojiRequest {
  spaceId: string;
}

export interface EmojiItemInterface {
  hash: string;
  name: string;
  emojiId: string;
}
