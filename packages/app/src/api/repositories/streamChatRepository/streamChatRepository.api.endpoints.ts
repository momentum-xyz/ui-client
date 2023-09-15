export const streamChatRepositoryApiEndpoints = () => {
  const BASE_URL = '/streamchat';

  return {
    baseURL: BASE_URL,
    token: `${BASE_URL}/:objectId/token`
  };
};
