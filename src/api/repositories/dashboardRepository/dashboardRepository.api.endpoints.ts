import {appVariables} from 'api/constants';

export const dashboardRepositoryApiEndpoints = () => {
  const BASE_URL = `${appVariables.BACKEND_ENDPOINT_URL}/dashboard`;

  return {
    base: BASE_URL,
    create: `${BASE_URL}/create`
  };
};
