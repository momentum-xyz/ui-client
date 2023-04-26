export const userRepositoryEndpoints = () => {
  const BASE_URL = '/users';

  return {
    list: `${BASE_URL}`,
    me: `${BASE_URL}/me`,
    profile: `${BASE_URL}/:userId`,
    ownedWorldList: `${BASE_URL}/:userId/worlds`,
    stakedWorldList: `${BASE_URL}/:userId/staked-worlds`
  };
};
