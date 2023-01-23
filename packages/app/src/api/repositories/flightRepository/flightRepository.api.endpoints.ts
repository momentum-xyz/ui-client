export const flightRepositoryEndpoints = () => {
  const BASE_URL = '/worlds/:spaceId';

  return {
    startFlyWithMe: `${BASE_URL}/fly-with-me/start`,
    stopFlyWithMe: `${BASE_URL}/fly-with-me/stop`,
    flyToMe: `${BASE_URL}/fly-to-me`
  };
};
