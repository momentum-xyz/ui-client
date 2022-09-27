export interface UploadEmojiRequest {
  spaceId: string;
  file: File;
  name: string;
}

export interface UploadEmojiResponse {
  hash: string;
  emojiId: string;
  message: string;
}

export interface DeleteEmojiRequest {
  emojiId: string;
  spaceId: string;
}

export interface DeleteEmojiResponse {}
