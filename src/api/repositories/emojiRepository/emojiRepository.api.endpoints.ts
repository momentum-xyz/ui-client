import {appVariables} from 'api/constants';

export const emojiRepositoryEndpoints = () => {
  const SPACE_EMOJI_BASE_URL = `${appVariables.BACKEND_ENDPOINT_URL}/space-emoji`;
  const EMOJI_BASE_URL = `${appVariables.BACKEND_ENDPOINT_URL}/emoji`;

  return {
    worldEmojiList: `${SPACE_EMOJI_BASE_URL}/:worldId`,
    spaceEmojiList: `${SPACE_EMOJI_BASE_URL}/:spaceId`,
    emojiUpload: `${EMOJI_BASE_URL}/upload/:spaceId`,
    emojiAddToSpace: `${SPACE_EMOJI_BASE_URL}/add`,
    emojiDelete: EMOJI_BASE_URL
  };
};
