export const spaceUserAttributeRepositoryEndpoints = () => {
  const BASE_URL = '/objects';

  return {
    attribute: `${BASE_URL}/:spaceId/:userId/attributes`,
    allUsers: `${BASE_URL}/:spaceId/all-users/attributes`,
    attributeCount: `${BASE_URL}/:spaceId/all-users/count`
  };
};
