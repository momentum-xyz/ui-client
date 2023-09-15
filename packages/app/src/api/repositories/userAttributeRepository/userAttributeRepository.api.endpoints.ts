export const userAttributesRepositoryEndpoints = () => {
  // const BASE_URL = '/worlds/:worldId/users/:userId/attributes';
  const BASE_URL = '/users/:userId/attributes';
  // const BASE_URL = '/users/attributes';

  return {
    // pluginAttributes: `${BASE_URL}/:pluginId`,
    // pluginAttributeValue: `${BASE_URL}/:pluginId/:attributeName`
    pluginAttributeValue: `${BASE_URL}`
  };
};
