import {appVariables} from 'api/constants';

export const assets3DEndpoints = () => {
  const BASE_URL = `${appVariables.BACKEND_API_URL}/assets-3d`;

  return {
    assets3D: BASE_URL
  };
};
