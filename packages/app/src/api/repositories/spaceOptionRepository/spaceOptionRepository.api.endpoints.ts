export const spaceOptionRepositoryEndpoints = () => {
  const BASE_URL = '/objects/:spaceId';

  return {
    options: `${BASE_URL}/options`,
    subOption: `${BASE_URL}/options/sub`
  };
};
