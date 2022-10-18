import {appVariables} from 'api/constants';

export const configRepositoryEndpoints = () => {
  const BASE_URL = `${appVariables.BACKEND_API_URL}/config`;

  return {
    config: `${BASE_URL}/ui-client`
  };
};
