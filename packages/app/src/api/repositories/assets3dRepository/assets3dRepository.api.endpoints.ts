import {appVariables} from 'api/constants';

export const assets3dRepositoryEndpoints = () => {
  const BASE_URL = `${appVariables.BACKEND_API_URL}/assets-3d`;

  return {
    upload: `${BASE_URL}/upload`,
    get: BASE_URL
  };
};
