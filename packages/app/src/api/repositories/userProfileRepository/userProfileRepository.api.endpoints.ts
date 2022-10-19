import {appVariables} from 'api/constants';

export const userRepositoryEndpoints = () => {
  const BASE_URL = `${appVariables.BACKEND_API_URL}/profile`;

  return {
    profile: BASE_URL
  };
};
