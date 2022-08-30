export interface EmojiConfigRequest {
  worldId: string;
}

interface EmojiConfigItemInterface {
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

export interface EmojiConfigResponse extends Array<EmojiConfigItemInterface> {}
