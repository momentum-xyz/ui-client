import {appVariables} from 'api/constants';

export const userRepositoryEndpoints = () => {
  const BASE_URL = `${appVariables.BACKEND_ENDPOINT_URL}/users`;

  return {
    profile: `${BASE_URL}/profile`
  };
};
