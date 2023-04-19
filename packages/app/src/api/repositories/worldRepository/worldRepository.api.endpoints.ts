export const worldRepositoryEndpoints = () => {
  const BASE_URL = '/worlds';

  return {
    list: `${BASE_URL}`,
    onlineUsers: `${BASE_URL}/:worldId/online-users`
  };
};
