export const spaceRepositoryEndpoints = () => {
  const BASE_URL = '/spaces';

  return {
    base: `${BASE_URL}`,
    space: `${BASE_URL}/:spaceId`
  };
};
