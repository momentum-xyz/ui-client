import {useFetch, usePost} from './useApi';

export interface VibeToggleDto {
  vibeAction: '+1' | '-1';
}

export interface VibeCountDTO {
  count: number;
}

export const useVibeCheck = (spaceId: string) => {
  return useFetch<boolean>(window._env_.BACKEND_ENDPOINT_URL + `/vibes/${spaceId}/check`, {
    fetchPolicy: 'network-only'
  });
};

export const useVibeToggle = (spaceId: string) => {
  return usePost<any, VibeToggleDto>(
    window._env_.BACKEND_ENDPOINT_URL + `/vibes/${spaceId}/toggle`
  );
};

export const useGetVibeCount = (spaceId: string) => {
  return useFetch<VibeCountDTO>(window._env_.BACKEND_ENDPOINT_URL + `/vibes/${spaceId}/count`, {
    fetchPolicy: 'network-only'
  });
};
