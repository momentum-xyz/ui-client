import {appVariables} from 'api/constants';

export const spaceUserAttributesRepositoryEndpoints = () => {
  const BASE_URL = `${appVariables.BACKEND_API_URL}/worlds/:worldId/users/:userId/attributes`;

  return {
    pluginAttributes: `${BASE_URL}/:pluginId`,
    pluginAttributeValue: `${BASE_URL}/:pluginId/:attributeName`
  };
};
