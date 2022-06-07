import {appVariables} from 'api/constants';

export const playlistRepositoryEndpoints = () => {
  const BASE_URL = `${appVariables.BACKEND_ENDPOINT_URL}/space-playlist`;

  return {
    base: `${BASE_URL}`
  };
};
