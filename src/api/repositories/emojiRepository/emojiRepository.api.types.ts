export interface EmojiConfigRequest {
  worldId: string;
}

interface EmojiConfigItemLegacyInterface {
  emoji: {
    id: {
      type: string;
      data: Buffer;
    };
    code: string;
    hash: string;
    name: string;
    createdAt: string | null;
    updatedAt: string | null;
  };
  emojiId: {
    type: string;
    data: Buffer;
  };
  spaceId: {
    type: string;
    data: Buffer;
  };
  order: number;
}
export interface EmojiConfigLegacyResponse extends Array<EmojiConfigItemLegacyInterface> {}

interface EmojiConfigItemInterface {
  id: string;
  code: string;
  hash: string;
  name: string;
  createdAt: string | null;
  updatedAt: string | null;
  spaceId: string;
  spaceName?: string;
  order: number;
}
export interface EmojiConfigResponse extends Array<EmojiConfigItemInterface> {}

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

export interface AssignEmojiToSpaceRequest {
  emojiId: string;
  spaceId: string;
}

export interface AssignEmojiToSpaceResponse extends Array<EmojiConfigItemInterface> {}

export interface DeleteEmojiRequest {
  emojiId: string;
  spaceId: string;
  order: number;
}
export interface DeleteEmojiResponse {}
