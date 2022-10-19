import {appVariables} from 'api/constants';

export const attendeesRepositoryEndpoints = () => {
  const BASE_URL = `${appVariables.BACKEND_ENDPOINT_URL}/attendees`;

  return {
    base: BASE_URL,
    add: `${BASE_URL}/add`,
    remove: `${BASE_URL}/remove`
  };
};
