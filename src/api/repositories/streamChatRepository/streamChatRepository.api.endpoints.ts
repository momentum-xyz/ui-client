import {appVariables} from 'api/constants';

export const streamChatRepositoryApiEndpoints = () => {
  // const BASE_URL = `${appVariables.BACKEND_ENDPOINT_URL}/streamchat`;
  const BASE_URL = "http://localhost:4000/api/v3/backend/streamchat";


  return {
    baseURL: BASE_URL,
    token: `:spaceId/channel-token`,
  };
};
