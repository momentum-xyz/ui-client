export const spaceUserAttributeRepositoryEndpoints = () => {
  const BASE_URL = '/spaces';

  return {
    attribute: `${BASE_URL}/:spaceId/:userId/attributes`,
    allUsers: `${BASE_URL}/:spaceId/all-users/attributes`
  };
};
