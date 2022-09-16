import {appVariables} from 'api/constants';

export const emojiRepositoryEndpoints = () => {
  const BASE_URL = `${appVariables.BACKEND_ENDPOINT_URL}/space-emoji`;
  const BASE_URL_EMOJI = `${appVariables.BACKEND_ENDPOINT_URL}/emoji`;

  return {
    spaceEmojiConfig: `${BASE_URL}/:worldId`,
    emojiUpload: `${BASE_URL_EMOJI}/upload/:spaceId`,
    emojiAddToSpace: `${BASE_URL}/add`,
    emojiDelete: BASE_URL_EMOJI
  };
};
