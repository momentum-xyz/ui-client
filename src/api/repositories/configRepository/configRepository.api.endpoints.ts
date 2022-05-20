import {IS_DEV_ENVIRONMENT} from 'api/constants';

/**
 * Domain for loading whole app config.
 * 1. localhost: to use env.development file
 * 2. otherwise: to take current origin
 */
const BASE_URL = IS_DEV_ENVIRONMENT ? process.env.CONFIG_URL : document.location.origin;

export const configRepositoryEndpoints = {
  variables: `${BASE_URL}/config/ui-client`
};
