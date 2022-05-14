import {endpoints} from 'api/constants';

const BASE_URL = `${endpoints.backendUrl}/magic`;

export const magicRepositoryEndpoints = {
  base: BASE_URL,
  generateLink: `${BASE_URL}/generate-link`
};
