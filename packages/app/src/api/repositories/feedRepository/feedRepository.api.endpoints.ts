import {appVariables} from 'api/constants';

export const feedRepositoryEndpoints = () => {
  const BASE_URL = `${appVariables.BACKEND_API_URL}`;

  return {
    feed: `${BASE_URL}/newsfeed`,
    notifications: `${BASE_URL}/notifications`
  };
};
