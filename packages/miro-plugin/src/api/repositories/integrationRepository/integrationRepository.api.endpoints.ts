import {appVariables} from 'api/constants/app.variables';

export const integrationRepositoryEndpoints = () => {
  const BASE_URL = `${appVariables.BACKEND_ENDPOINT_URL}/space-integrations`;

  return {
    fetch: `${BASE_URL}/:spaceId/:integrationType`,
    enable: `${BASE_URL}/enable`,
    disable: `${BASE_URL}/disable`
  };
};
