import {appVariables} from 'api/constants';

export const worldBuilderEndpoints = () => {
  const BASE_URL = `${appVariables.BACKEND_ENDPOINT_URL}/world-builder`;

  return {
    validateName: `${BASE_URL}/validate-name`,
    valiedateDomain: `${BASE_URL}/validate-domain`
  };
};
