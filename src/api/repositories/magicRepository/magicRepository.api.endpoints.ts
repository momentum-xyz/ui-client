import {appVariables} from 'api/constants';

export const magicRepositoryEndpoints = () => {
  const BASE_URL = `${appVariables.BACKEND_ENDPOINT_URL}/magic`;

  return {
    base: BASE_URL,
    generateLink: `${BASE_URL}/generate-link`
  };
};
