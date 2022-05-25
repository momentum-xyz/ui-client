import {appVariables} from 'api/constants';

export const tablesRepositoryEndpoints = () => {
  const BASE_URL = `${appVariables.BACKEND_ENDPOINT_URL}/tables`;

  return {
    find: `${BASE_URL}/find`
  };
};
