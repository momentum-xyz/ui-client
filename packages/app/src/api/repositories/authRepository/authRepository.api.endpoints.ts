export const authRepositoryEndpoints = () => {
  const BASE_URL = '/auth';

  return {
    challenge: `${BASE_URL}/challenge`,
    token: `${BASE_URL}/token`,
    // TODO move to user repository if confirmed
    attachAccount: `/users/me/attach-account`,
    guestToken: `${BASE_URL}/guest-token`
  };
};
