import {EmojiConfigItemInterface, EmojiConfigItemLegacyInterface} from 'core/interfaces';

export interface WorldEmojiesRequest {
  worldId: string;
}

export interface WorldEmojiesLegacyResponse extends Array<EmojiConfigItemLegacyInterface> {}

export interface WorldEmojiesResponse extends Array<EmojiConfigItemInterface> {}

export interface SpaceEmojiesRequest {
  spaceId: string;
}

export interface SpaceEmojiesLegacyResponse extends Array<EmojiConfigItemLegacyInterface> {}

export interface SpaceEmojiesResponse extends Array<EmojiConfigItemInterface> {}

export interface AssignEmojiToSpaceRequest {
  emojiId: string;
  spaceId: string;
}

export interface AssignEmojiToSpaceResponse extends Array<EmojiConfigItemInterface> {}
