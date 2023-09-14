export const objectUserAttributeRepositoryEndpoints = () => {
  const BASE_URL = '/objects';

  return {
    attribute: `${BASE_URL}/:objectId/:userId/attributes`,
    subAttribute: `${BASE_URL}/:objectId/:userId/attributes/sub`,
    allUsers: `${BASE_URL}/:objectId/all-users/attributes`,
    attributeCount: `${BASE_URL}/:objectId/all-users/count`,
    attributeList: `${BASE_URL}/:objectId/all-users/attributes/:pluginId/:attributeName/entries`
  };
};
