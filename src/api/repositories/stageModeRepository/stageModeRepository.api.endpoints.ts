import {appVariables} from 'api/constants';

export const stageModeRepositoryEndpoints = () => {
  const BASE_URL = `${appVariables.BACKEND_ENDPOINT_URL}/stage-mode`;

  // FIXME: use params :spaceId
  return {
    leave: (spaceId: string) => `${BASE_URL}/${spaceId}/leave`,
    join: (spaceId: string) => `${BASE_URL}/${spaceId}/join`
  };
};
