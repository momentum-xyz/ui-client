import {appVariables} from 'api/constants';

export const dashboardRepositoryApiEndpoints = () => {
  const BASE_URL = `${appVariables.BACKEND_ENDPOINT_URL}/dashboard`;
  const UPLOAD_URL = `${appVariables.BACKEND_ENDPOINT_URL}/upload`;

  return {
    base: BASE_URL,
    upload: UPLOAD_URL,
    updatePositions: `${BASE_URL}/update-positions`,
    create: `${BASE_URL}/create`,
    delete: `${BASE_URL}/delete`,
    update: `${BASE_URL}/update`
  };
};
