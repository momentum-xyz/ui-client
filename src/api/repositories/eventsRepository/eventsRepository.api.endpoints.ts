import {appVariables} from 'api/constants';

export const eventsRepositoryEndpoints = () => {
  const BASE_URL = `${appVariables.BACKEND_ENDPOINT_URL}/events`;

  return {
    base: `${BASE_URL}`
  };
};
