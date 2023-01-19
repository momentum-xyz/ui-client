export const agoraRepositoryApiEndpoints = () => {
  const BASE_URL = '/spaces';

  return {
    token: `${BASE_URL}/:spaceId/agora/token`
  };
};
