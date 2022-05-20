import {appConstants} from 'api/constants';

/**
 * Domain for loading whole app config.
 * 1. localhost: to use env.development file
 * 2. otherwise: to use current origin
 */
const BASE_URL = appConstants.IS_DEV_ENVIRONMENT
  ? process.env.REACT_APP_CONFIG_URL
  : document.location.origin;

export const configRepositoryEndpoints = {
  config: `${BASE_URL}/config/ui-client`
};
