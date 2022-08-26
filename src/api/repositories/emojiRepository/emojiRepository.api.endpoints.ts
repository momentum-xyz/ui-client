import {appVariables} from 'api/constants';

export const emojiRepositoryEndpoints = () => {
  const BASE_URL = `${appVariables.BACKEND_ENDPOINT_URL}/space-emoji`;

  return {
    spaceEmojiConfig: `${BASE_URL}/:worldId`
  };
};
