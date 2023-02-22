export const flightRepositoryEndpoints = () => {
  const BASE_URL = '/worlds/:spaceId';

  return {
    flyToMe: `${BASE_URL}/fly-to-me`
  };
};
