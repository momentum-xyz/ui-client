import {appVariables} from 'api/constants';

export const tokenRuleRepositoryEndpoints = () => {
  const BASE_URL = `${appVariables.BACKEND_ENDPOINT_URL}/token-rule`;

  return {
    base: `${BASE_URL}`,
    create: `${BASE_URL}/create`,
    all: `${BASE_URL}/all`,
    process: `${BASE_URL}/process`,
    allowedOptions: `${BASE_URL}/allowed-options`,
    search: `${BASE_URL}/search`,
    apply: `${BASE_URL}/apply`
  };
};
