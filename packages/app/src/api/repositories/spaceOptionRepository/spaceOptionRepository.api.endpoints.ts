export const spaceOptionRepositoryEndpoints = () => {
  const BASE_URL = '/spaces/:spaceId';

  return {
    options: `${BASE_URL}/options`,
    subOption: `${BASE_URL}/options/sub`
  };
};
