import {appVariables} from 'api/constants';

export const spaceRepositoryEndpoints = () => {
  const BASE_URL = `${appVariables.BACKEND_API_URL}/worlds/:worldId/spaces/:spaceId`;

  return {
    options: `${BASE_URL}/options`,
    subOption: `${BASE_URL}/options/sub`
  };
};
