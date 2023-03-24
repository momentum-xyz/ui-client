export const authRepositoryEndpoints = () => {
  const BASE_URL = '/auth';

  return {
    challenge: `${BASE_URL}/challenge`,
    token: `${BASE_URL}/token`,
    attachAccount: `${BASE_URL}/attach-account`,
    guestToken: `${BASE_URL}/guest-token`
  };
};
