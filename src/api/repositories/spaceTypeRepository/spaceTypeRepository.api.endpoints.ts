import {endpoints} from 'api/constants';

const BASE_URL = `${endpoints.backendUrl}/space-type`;

export const spaceTypeRepositoryEndpoints = {
  allowedTypes: `${BASE_URL}`
};
