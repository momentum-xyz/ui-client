import {appVariables} from 'api/constants';

export const spaceInfoRepository = () => {
  const BASE_URL = `${appVariables.BACKEND_API_URL}/spaces`;

  return {
    spaceInfo: `${BASE_URL}/:spaceId`
  };
};
