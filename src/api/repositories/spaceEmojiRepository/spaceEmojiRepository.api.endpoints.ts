import {appVariables} from 'api/constants';

export const spaceEmojiRepositoryEndpoints = () => {
  const BASE_URL = `${appVariables.BACKEND_ENDPOINT_URL}/space-emoji`;

  return {
    // these fetch endpoints are in fact the same api - the naming difference is purely cosmetic
    worldEmojiList: `${BASE_URL}/:worldId`,
    spaceEmojiList: `${BASE_URL}/:spaceId`,
    emojiAddToSpace: `${BASE_URL}/add`
  };
};
