import {appVariables} from 'api/constants';

export const pluginsRepositoryEndpoints = () => {
  const BASE_URL = `${appVariables.BACKEND_API_URL}/plugins`;

  return {
    metadata: `${BASE_URL}/metadata`,
    options: `${BASE_URL}/options`
  };
};
