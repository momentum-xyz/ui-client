import {appVariables} from 'api/constants';

export const authRepositoryEndpoints = () => {
  const BASE_URL = `${appVariables.BACKEND_API_URL}/auth`;

  return {
    challenge: `${BASE_URL}/challenge`,
    token: `${BASE_URL}/token`,
    guestToken: `${BASE_URL}/guest-token`
  };
};
