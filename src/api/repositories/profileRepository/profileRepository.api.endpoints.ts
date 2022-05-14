import {endpoints} from 'api/constants';

const BASE_URL = `${endpoints.backendUrl}/profile`;

export const userRepositoryEndpoints = {
  edit: `${BASE_URL}/edit`
};
