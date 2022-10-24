import {appVariables} from 'api/constants';

export const userRepositoryEndpoints = () => {
  const BASE_URL = `${appVariables.BACKEND_ENDPOINT_URL}/profile`;

  return {
    edit: `${BASE_URL}/edit`,
    avatarUpload: `${BASE_URL}/avatar/upload`
  };
};
