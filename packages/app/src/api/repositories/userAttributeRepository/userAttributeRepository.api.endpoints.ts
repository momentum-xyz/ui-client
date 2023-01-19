export const spaceUserAttributesRepositoryEndpoints = () => {
  const BASE_URL = '/worlds/:worldId/users/:userId/attributes';

  return {
    pluginAttributes: `${BASE_URL}/:pluginId`,
    pluginAttributeValue: `${BASE_URL}/:pluginId/:attributeName`
  };
};
