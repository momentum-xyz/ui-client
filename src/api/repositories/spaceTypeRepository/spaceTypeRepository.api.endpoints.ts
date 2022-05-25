import {appVariables} from 'api/constants';

export const spaceTypeRepositoryEndpoints = () => {
  const BASE_URL = `${appVariables.BACKEND_ENDPOINT_URL}/space-type`;

  return {
    allowedTypes: `${BASE_URL}`
  };
};
