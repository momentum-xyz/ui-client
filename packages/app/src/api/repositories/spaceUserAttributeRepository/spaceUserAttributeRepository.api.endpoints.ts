export const spaceUserAttributeRepositoryEndpoints = () => {
  const BASE_URL = '/objects';

  return {
    attribute: `${BASE_URL}/:spaceId/:userId/attributes`,
    subAttribute: `${BASE_URL}/:spaceId/:userId/attributes/sub`,
    allUsers: `${BASE_URL}/:spaceId/all-users/attributes`,
    attributeCount: `${BASE_URL}/:spaceId/all-users/count`
  };
};
