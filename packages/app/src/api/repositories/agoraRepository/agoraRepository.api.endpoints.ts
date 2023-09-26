export const agoraRepositoryApiEndpoints = () => {
  const BASE_URL = '/objects';

  return {
    token: `${BASE_URL}/:objectId/agora/token`
  };
};
