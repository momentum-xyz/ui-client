import {appVariables} from 'api/constants';

import {useFetch, usePost} from './useApi';

export interface VibeToggleDto {
  vibeAction: '+1' | '-1';
}

export interface VibeCountDTO {
  count: number;
}

export const useVibeCheck = (spaceId: string) => {
  return useFetch<boolean>(appVariables.BACKEND_ENDPOINT_URL + `/vibes/${spaceId}/check`, {
    fetchPolicy: 'network-only'
  });
};

export const useVibeToggle = (spaceId: string) => {
  return usePost<any, VibeToggleDto>(
    appVariables.BACKEND_ENDPOINT_URL + `/vibes/${spaceId}/toggle`
  );
};

export const useGetVibeCount = (spaceId: string) => {
  return useFetch<VibeCountDTO>(appVariables.BACKEND_ENDPOINT_URL + `/vibes/${spaceId}/count`, {
    fetchPolicy: 'network-only'
  });
};
