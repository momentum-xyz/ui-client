import {appVariables} from 'api/constants';

export const streamChatRepositoryApiEndpoints = () => {
  const BASE_URL = `${appVariables.BACKEND_API_URL}/streamchat`;

  return {
    baseURL: BASE_URL,
    token: `${BASE_URL}/:spaceId/token`
  };
};
