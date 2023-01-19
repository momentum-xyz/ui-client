export const worldRepositoryEndpoints = () => {
  const BASE_URL = '/worlds/:worldId';

  return {
    getSpaceWithSubspaces: `${BASE_URL}/explore`,
    searchSpaces: `${BASE_URL}/explore/search`,
    onlineUsers: `${BASE_URL}/online-users`
  };
};
