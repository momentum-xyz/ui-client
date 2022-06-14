import {appVariables} from 'api/constants';

export const communicationRepositoryEndpoints = () => {
  const BASE_URL = `${appVariables.BACKEND_ENDPOINT_URL}/meeting`;

  return {
    remove: (spaceId: string, userId: string) => `${BASE_URL}/${spaceId}/users/${userId}/kick`,
    mute: (spaceId: string, userId: string) => `${BASE_URL}/${spaceId}/users/${userId}/mute`,
    muteAll: (spaceId: string) => `${BASE_URL}/${spaceId}/users/mute-all`
  };
};
