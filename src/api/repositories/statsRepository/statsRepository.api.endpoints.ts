import {appVariables} from 'api/constants';

export const statsRepositoryEndpoints = () => {
  const BASE_URL = `${appVariables.BACKEND_ENDPOINT_URL}/stats`;

  return {
    stats: `${BASE_URL}`
  };
};
