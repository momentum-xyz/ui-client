import {appVariables} from 'api/constants';

export const versionRepositoryEndpoints = () => {
  const BASE_URL = `${appVariables.BE_URL}/version`;

  return {
    version: `${BASE_URL}`
  };
};
