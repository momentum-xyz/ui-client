import {endpoints} from 'api/constants';

const BASE_URL = `${endpoints.guestProviderUrl}/v0/guest`;

export const guestRepositoryEndpoints = {
  login: `${BASE_URL}/login`,
  consent: `${BASE_URL}/consent`
};
