import {appVariables} from 'api/constants';

export const userRepositoryEndpoints = () => {
  const BASE_URL = `${appVariables.BACKEND_ENDPOINT_URL}/users`;

  return {
    me: `${BASE_URL}/me`,
    check: `${BASE_URL}/check`,
    inviteToSpace: `${BASE_URL}/invite`,
    search: `${BASE_URL}/search`,
    profile: `${BASE_URL}/profile`,
    online: `${BASE_URL}/online`,
    initiatives: `${BASE_URL}/users/:userId/initiatives`
  };
};
