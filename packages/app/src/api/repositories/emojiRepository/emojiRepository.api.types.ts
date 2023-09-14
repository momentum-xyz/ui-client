export interface EmojiUploadRequest {
  key: string;
  objectId: string;
  name: string;
  hash: string;
  emojiId: string;
}

export interface EmojiDeleteRequest {
  key: string;
  objectId: string;
}

export interface FetchEmojiRequest {
  objectId: string;
}

export interface EmojiItemInterface {
  hash: string;
  name: string;
  emojiId: string;
}
