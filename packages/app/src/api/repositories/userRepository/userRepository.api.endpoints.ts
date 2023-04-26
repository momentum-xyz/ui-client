export const userRepositoryEndpoints = () => {
  const BASE_URL = '/users';

  return {
    list: `${BASE_URL}`,
    me: `${BASE_URL}/me`,
    myStakes: `${BASE_URL}/me/stakes`,
    myWallets: `${BASE_URL}/me/wallets`,
    profile: `${BASE_URL}/:userId`,
    ownedWorldList: `${BASE_URL}/:userId/worlds`,
    stakedWorldList: `${BASE_URL}/:userId/staked-worlds`
  };
};
