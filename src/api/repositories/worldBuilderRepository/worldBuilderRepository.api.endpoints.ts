import {appVariables} from 'api/constants';

export const worldBuilderEndpoints = () => {
  const BASE_URL = `${appVariables.BACKEND_V4_ENDPOINT_URL}/world-builder`;

  return {
    validateName: `${BASE_URL}/validate-name`,
    valiedateDomain: `${BASE_URL}/validate-domain`,
    templates: `${BASE_URL}/templates`,
    checkPermissions: `${BASE_URL}/check-permissions`,
    create: `${BASE_URL}/create`
  };
};
