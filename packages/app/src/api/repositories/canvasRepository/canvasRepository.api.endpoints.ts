export const canvasRepositoryEndpoints = () => {
  const BASE_URL = '/canvas';

  return {
    userContributions: `${BASE_URL}/:objectId/user-contributions`
  };
};
