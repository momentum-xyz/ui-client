import {appVariables} from 'api/constants';

export const tokenRepositoryEndpoints = () => {
  const BASE_URL = `${appVariables.BACKEND_ENDPOINT_URL}/token`;

  return {
    base: `${BASE_URL}`,
    info: `${BASE_URL}/info`,
    create: `${BASE_URL}/create`,
    search: `${BASE_URL}/search`
  };
};
