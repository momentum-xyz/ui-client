import {appVariables} from 'api/constants';

export const flyWithMeRepositoryEndpoints = () => {
  const BASE_URL = `${appVariables.BACKEND_ENDPOINT_URL}/fly-with-me`;

  return {
    start: `${BASE_URL}/:spaceId/start`,
    stop: `${BASE_URL}/:spaceId/stop`
  };
};
