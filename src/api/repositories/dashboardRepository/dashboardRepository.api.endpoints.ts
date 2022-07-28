import {appVariables} from 'api/constants';

export const dashboardRepositoryApiEndpoints = () => {
  const BASE_URL = `${appVariables.BACKEND_ENDPOINT_URL}/dashboard`;

  return {
    fetchDashboard: `${BASE_URL}/:spaceId`,
    updatePositions: `${BASE_URL}/update-positions`,
    create: `${BASE_URL}/create/:spaceId`,
    delete: `${BASE_URL}/delete/:tileId`,
    update: `${BASE_URL}/update/:tileId`
  };
};
