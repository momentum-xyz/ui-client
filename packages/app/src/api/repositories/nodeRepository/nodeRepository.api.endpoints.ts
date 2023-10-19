export const configRepositoryEndpoints = () => {
  const BASE_URL = '/node';

  return {
    getChallenge: `${BASE_URL}/get-challenge`,
    hostingAllowList: `${BASE_URL}/hosting-allow-list`,
    hostingAllowListRemove: `${BASE_URL}/hosting-allow-list/:userId`
  };
};
