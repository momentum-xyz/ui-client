import {appVariables} from 'api/constants';

export const agoraRepositoryApiEndpoints = () => {
  const BASE_URL = `${appVariables.BACKEND_ENDPOINT_URL}/agora`;

  return {
    token: `${BASE_URL}/token`
  };
};
