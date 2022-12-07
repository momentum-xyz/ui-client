import {appVariables} from 'api/constants';

export const assets2dRepositoryEndpoints = () => {
  const BASE_URL = `${appVariables.BACKEND_API_URL}/assets-2d`;

  return {
    asset: `${BASE_URL}/:assetId`
  };
};
