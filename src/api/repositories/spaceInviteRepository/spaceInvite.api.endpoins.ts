import {appVariables} from 'api/constants';

export const spaceInviteEndpoints = () => {
  const BASE_URL = `${appVariables.BACKEND_ENDPOINT_URL}/space-invite`;

  return {
    base: `${BASE_URL}`
  };
};
