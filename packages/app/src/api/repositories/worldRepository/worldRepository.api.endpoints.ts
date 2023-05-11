export const worldRepositoryEndpoints = () => {
  const BASE_URL = '/worlds';

  return {
    worldList: `${BASE_URL}`,
    world: `${BASE_URL}/:worldId`
  };
};
