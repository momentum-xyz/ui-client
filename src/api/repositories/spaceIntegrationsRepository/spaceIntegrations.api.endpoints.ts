import {appVariables} from 'api/constants';

export const spaceIntegrationsEndpoints = () => {
  const BASE_URL = `${appVariables.BACKEND_ENDPOINT_URL}/space-integrations`;

  return {
    stageMode: `${BASE_URL}/:spaceId/stage_mode`,
    enable: `${BASE_URL}/enable`,
    disable: `${BASE_URL}/disable`,
    check: `${BASE_URL}/:spaceId/check`
  };
};
