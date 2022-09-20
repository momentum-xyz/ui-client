import {appVariables} from 'api/constants';

export const emojiRepositoryEndpoints = () => {
  const BASE_URL = `${appVariables.BACKEND_ENDPOINT_URL}/emoji`;

  return {
    emojiUpload: `${BASE_URL}/upload/:spaceId`,
    emojiDelete: BASE_URL
  };
};
