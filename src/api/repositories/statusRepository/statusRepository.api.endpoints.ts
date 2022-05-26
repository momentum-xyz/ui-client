import {appVariables} from 'api/constants';

export const statusRepositoryEndpoints = () => {
  const BASE_URL = `${appVariables.BACKEND_ENDPOINT_URL}/status`;

  return {
    base: `${BASE_URL}`
  };
};
