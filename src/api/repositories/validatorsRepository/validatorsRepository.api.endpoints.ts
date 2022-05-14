import {endpoints} from 'api/constants';

const BASE_URL = `${endpoints.backendUrl}/space`;

export const validatorRepositoryEndpoints = {
  getValidators: `${BASE_URL}/get-validators`,
  bookmark: `${BASE_URL}/bookmark`
};
