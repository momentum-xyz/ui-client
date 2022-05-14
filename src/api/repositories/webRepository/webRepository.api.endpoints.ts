import {endpoints} from 'api/constants';

const BASE_URL = `${endpoints.web3ProviderUrl}/v0/web3`;

export const web3RepositoryEndpoints = {
  challenge: `${BASE_URL}/challenge`,
  login: `${BASE_URL}/login`,
  consent: `${BASE_URL}/consent`
};
