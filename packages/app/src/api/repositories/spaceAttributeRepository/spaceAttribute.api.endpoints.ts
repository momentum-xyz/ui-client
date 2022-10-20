import {appVariables} from 'api/constants';

export const spaceAttributesRepositoryEndpoints = () => {
  const BASE_URL = `${appVariables.BACKEND_API_URL}/worlds/:worldId/spaces/:spaceId/attributes`;

  return {
    pluginAttributes: `${BASE_URL}/:pluginId`,
    pluginAttributeValue: `${BASE_URL}/:pluginId/:attributeName`
  };
};
