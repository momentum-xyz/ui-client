import {appVariables} from 'api/constants';

export const emojiRepositoryEndpoints = () => {
  const EMOJI_BASE_URL = `${appVariables.BACKEND_ENDPOINT_URL}/emoji`;

  return {
    emojiUpload: `${EMOJI_BASE_URL}/upload/:spaceId`,
    emojiDelete: EMOJI_BASE_URL
  };
};
