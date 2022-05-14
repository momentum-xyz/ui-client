import {endpoints} from 'api/constants';

const BASE_URL = `${endpoints.backendUrl}/stage-mode`;

export const stageModeRepositoryEndpoints = {
  leave: (spaceId: string) => `${BASE_URL}/${spaceId}/leave`,
  join: (spaceId: string) => `${BASE_URL}/${spaceId}/join`
};
