import {appVariables} from 'api/constants';

export const magicRepositoryEndpoints = () => {
  const BASE_URL = `${appVariables.BACKEND_ENDPOINT_URL}/magic`;

  return {
    fetchLink: `${BASE_URL}/:id`,
    generateLink: `${BASE_URL}/generate-link`
  };
};
