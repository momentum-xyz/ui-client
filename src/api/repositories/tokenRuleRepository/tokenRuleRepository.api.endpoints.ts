import {endpoints} from 'api/constants';

const BASE_URL = `${endpoints.backendUrl}/token-rule`;

export const tokenRuleRepositoryEndpoints = {
  base: `${BASE_URL}`,
  create: `${BASE_URL}/create`,
  all: `${BASE_URL}/all`,
  process: `${BASE_URL}/process`,
  allowedOptions: `${BASE_URL}/allowed-options`,
  search: `${BASE_URL}/search`,
  apply: `${BASE_URL}/apply`
};
