import {appVariables} from 'api/constants';

export const worldRepositoryEndpoints = () => {
  const BASE_URL = `${appVariables.BACKEND_API_URL}/worlds/:worldId`;

  return {
    getSpaceWithSubspaces: `${BASE_URL}/explore`
  };
};
