import {appVariables} from 'api/constants';

export const spaceAttributesRepositoryEndpoints = () => {
  const BASE_URL = `${appVariables.BACKEND_API_URL}/spaces/:spaceId/attributes`;

  return {
    attributes: `${BASE_URL}`,
    subAttribute: `${BASE_URL}/sub`
  };
};
