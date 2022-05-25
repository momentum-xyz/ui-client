import {appVariables} from 'api/constants';

/**
 * Domain for loading whole app config.
 * 1. localhost: to use env.development file
 * 2. otherwise: to use current origin
 */

export const configRepositoryEndpoints = () => {
  const BASE_URL = appVariables.BE_URL;

  return {
    config: `${BASE_URL}/config/ui-client`
  };
};
