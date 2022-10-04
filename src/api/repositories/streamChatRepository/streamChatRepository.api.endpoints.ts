import {appVariables} from 'api/constants';

export const streamChatRepositoryApiEndpoints = () => {
  const BASE_URL = `${appVariables.BACKEND_ENDPOINT_URL}/streamchat`;

  return {
    baseURL: BASE_URL,
    token: `:spaceId/channel-token`
  };
};
