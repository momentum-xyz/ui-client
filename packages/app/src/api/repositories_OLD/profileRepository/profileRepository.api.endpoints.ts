import {appVariables} from 'api/constants';

export const userRepositoryEndpoints = () => {
  const BASE_URL = `${appVariables.BACKEND_ENDPOINT_URL}/profile`;

  return {
    avatarUpload: `${BASE_URL}/avatar/upload`
  };
};
