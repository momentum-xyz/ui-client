import {endpoints} from 'api/constants';

const BASE_URL = `${endpoints.backendUrl}/tables`;

export const tablesRepositoryEndpoints = {
  find: `${BASE_URL}/find`
};
