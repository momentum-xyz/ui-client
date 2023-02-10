import {appVariables} from 'api/constants';

export const userRepositoryEndpoints = () => {
  const BASE_URL = `${appVariables.BACKEND_ENDPOINT_URL}/users`;

  return {
    inviteToSpace: `${BASE_URL}/invite`,
    search: `${BASE_URL}/search`,
    profile: `${BASE_URL}/profile`
  };
};
