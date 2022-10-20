import {appVariables} from 'api/constants';

export const spaceRepositoryEndpoints = () => {
  const BASE_URL = `${appVariables.BACKEND_API_URL}/worlds/:worldId/spaces/:spaceId`;

  return {
    base: BASE_URL,
    ancestors: `${BASE_URL}/ancestors`,
    inviteUser: `${BASE_URL}/users/:userId/invite`,
    plugins: `${BASE_URL}/plugins`
  };
};
