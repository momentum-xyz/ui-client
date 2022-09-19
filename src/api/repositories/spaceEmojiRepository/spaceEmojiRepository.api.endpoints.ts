import {appVariables} from 'api/constants';

export const spaceEmojiRepositoryEndpoints = () => {
  const SPACE_EMOJI_BASE_URL = `${appVariables.BACKEND_ENDPOINT_URL}/space-emoji`;

  return {
    // these fetch endpoints are in fact the same api - the naming difference is purely cosmetic
    worldEmojiList: `${SPACE_EMOJI_BASE_URL}/:worldId`,
    spaceEmojiList: `${SPACE_EMOJI_BASE_URL}/:spaceId`,
    emojiAddToSpace: `${SPACE_EMOJI_BASE_URL}/add`
  };
};
