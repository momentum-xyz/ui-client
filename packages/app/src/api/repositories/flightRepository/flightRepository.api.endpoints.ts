import {appVariables} from 'api/constants';

export const flightRepositoryEndpoints = () => {
  const BASE_URL = `${appVariables.BACKEND_API_URL}/worlds/:spaceId`;

  return {
    startFlyWithMe: `${BASE_URL}/fly-with-me/start`,
    stopFlyWithMe: `${BASE_URL}/fly-with-me/stop`,
    flyToMe: `${BASE_URL}/fly-to-me`
  };
};
