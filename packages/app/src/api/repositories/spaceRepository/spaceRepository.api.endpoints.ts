import {appVariables} from 'api/constants';

export const spaceRepositoryEndpoints = () => {
  const BASE_URL = `${appVariables.BACKEND_API_URL}/spaces`;

  return {
    base: `${BASE_URL}`,
    docks: `${BASE_URL}/:spaceId/docking-bulbs-count`
  };
};
