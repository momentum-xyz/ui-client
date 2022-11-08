import {appVariables} from 'api/constants';

export const mediaRepositoryEndpoints = () => {
  const BASE_URL = `${appVariables.BACKEND_V4_ENDPOINT_URL}/profile`;

  return {
    uploadImage: `${BASE_URL}/avatar`
  };
};
