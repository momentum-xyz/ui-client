import {appVariables} from 'api/constants';

export const userRepositoryEndpoints = () => {
  const BASE_URL = `${appVariables.BACKEND_API_URL}/users`;

  return {
    base: BASE_URL,
    profile: `${BASE_URL}/:userId`
  };
};
