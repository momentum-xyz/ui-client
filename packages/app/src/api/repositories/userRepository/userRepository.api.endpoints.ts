import {appVariables} from 'api/constants';

export const userRepositoryEndpoints = () => {
  const BASE_URL = `${appVariables.BACKEND_API_URL}/users`;

  return {
    me: `${BASE_URL}/me`,
    check: `${BASE_URL}/check`,
    profile: `${BASE_URL}/:userId`
  };
};
