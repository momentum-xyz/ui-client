import {appVariables} from 'api/constants';

export const favoriteRepositoryEndpoints = () => {
  const BASE_URL = `${appVariables.BACKEND_ENDPOINT_URL}/favorite`;

  return {
    base: `${BASE_URL}`
  };
};
