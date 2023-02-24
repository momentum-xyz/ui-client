export const spaceRepositoryEndpoints = () => {
  const BASE_URL = '/objects';

  return {
    base: `${BASE_URL}`,
    space: `${BASE_URL}/:spaceId`,
    docks: `${BASE_URL}/:spaceId/docking-bulbs-count`
  };
};
