import {appVariables} from 'api/constants';

export const agoraRepositoryApiEndpoints = () => {
  const BASE_URL = `${appVariables.BACKEND_API_URL}/spaces`;

  return {
    token: `${BASE_URL}/:spaceId/agora/token`
  };
};
