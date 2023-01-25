export const feedRepositoryEndpoints = () => {
  const BASE_URL = '';

  return {
    feed: `${BASE_URL}/newsfeed`,
    notifications: `${BASE_URL}/notifications`
  };
};
