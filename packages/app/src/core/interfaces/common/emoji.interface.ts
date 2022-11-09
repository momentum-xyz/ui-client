export interface EmojiConfigItemLegacyInterface {
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

export interface EmojiConfigItemInterface {
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
