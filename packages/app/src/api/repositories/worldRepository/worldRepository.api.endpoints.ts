export const worldRepositoryEndpoints = () => {
  const BASE_URL = '/worlds';

  return {
    worldList: `${BASE_URL}`,
    world: `${BASE_URL}/:worldId`,
    onlineUsers: `${BASE_URL}/:worldId/online-users`
  };
};
