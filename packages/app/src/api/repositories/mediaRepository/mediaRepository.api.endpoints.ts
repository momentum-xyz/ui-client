import {appVariables} from 'api/constants';

export const mediaRepositoryEndpoints = () => {
  const BASE_URL = `${appVariables.BACKEND_API_URL}/media/upload`;

  return {
    uploadImage: `${BASE_URL}/image`
  };
};
