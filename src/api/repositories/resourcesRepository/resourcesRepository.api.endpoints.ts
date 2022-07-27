import {appVariables} from 'api/constants';

export const resourcesRepositoryApiEndpoints = () => {
  const UPLOAD_URL = `${appVariables.BACKEND_ENDPOINT_URL}/upload`;

  return {
    upload: UPLOAD_URL
  };
};
