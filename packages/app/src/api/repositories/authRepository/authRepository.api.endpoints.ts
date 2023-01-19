export const authRepositoryEndpoints = () => {
  const BASE_URL = '/auth';

  return {
    challenge: `${BASE_URL}/challenge`,
    token: `${BASE_URL}/token`,
    guestToken: `${BASE_URL}/guest-token`
  };
};
