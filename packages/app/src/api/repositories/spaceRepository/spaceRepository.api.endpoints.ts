import {appVariables} from 'api/constants';

export const spaceRepositoryEndpoints = () => {
  const BASE_URL = `${appVariables.BACKEND_API_URL}/spaces/:spaceId`;

  return {
    docks: `${BASE_URL}/docking-bulbs-count`
  };
};
