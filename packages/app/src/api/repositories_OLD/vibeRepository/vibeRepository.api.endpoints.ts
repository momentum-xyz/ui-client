import {appVariables} from 'api/constants';

export const vibeRepositoryEndpoints = () => {
  const BASE_URL = `${appVariables.BACKEND_ENDPOINT_URL}/vibes`;

  return {
    count: `${BASE_URL}/:spaceId/count`,
    check: `${BASE_URL}/:spaceId/check`,
    toggle: `${BASE_URL}/:spaceId/toggle`
  };
};
