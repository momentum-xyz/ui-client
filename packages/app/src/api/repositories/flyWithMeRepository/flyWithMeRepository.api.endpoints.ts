import {appVariables} from 'api/constants';

export const flyWithMeRepositoryEndpoints = () => {
  const BASE_URL = `${appVariables.BACKEND_API_URL}/worlds/:spaceId/fly-with-me`;

  return {
    start: `${BASE_URL}/start`,
    stop: `${BASE_URL}/stop`
  };
};

// https://momentum-xyz.github.io/api/v4/worlds/{world_id}/fly-with-me/start
// https://momentum-xyz.github.io/api/v4/worlds/{world_id}/fly-with-me/stop
