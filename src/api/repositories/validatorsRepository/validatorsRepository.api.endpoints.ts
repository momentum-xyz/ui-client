import {appVariables} from 'api/constants';

export const validatorRepositoryEndpoints = () => {
  const BASE_URL = `${appVariables.BACKEND_ENDPOINT_URL}/space`;

  return {
    getValidators: `${BASE_URL}/get-validators`,
    bookmark: `${BASE_URL}/bookmark`
  };
};
