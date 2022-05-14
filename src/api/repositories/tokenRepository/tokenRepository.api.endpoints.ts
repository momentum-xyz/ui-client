import {endpoints} from 'api/constants';

const BASE_URL = `${endpoints.backendUrl}/token`;

export const tokenRepositoryEndpoints = {
  base: `${BASE_URL}`,
  info: `${BASE_URL}/info`,
  create: `${BASE_URL}/create`,
  search: `${BASE_URL}/search`
};
