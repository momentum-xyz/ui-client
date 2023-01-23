export const userRepositoryEndpoints = () => {
  const BASE_URL = '/users';

  return {
    me: `${BASE_URL}/me`,
    check: `${BASE_URL}/check`,
    profile: `${BASE_URL}/:userId`,
    mutualDocks: `${BASE_URL}/mutual-docks`
  };
};
