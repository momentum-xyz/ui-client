import {appVariables} from 'api/constants';

export const communicationRepositoryEndpoints = () => {
  const BASE_URL = `${appVariables.BACKEND_ENDPOINT_URL}/meeting`;

  return {
    remove: (spaceId: string, userId: string) => `${BASE_URL}/${spaceId}/users/${userId}/kick`
  };
};
