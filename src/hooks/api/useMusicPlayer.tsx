import {useFetch} from './useApi';

export const usePlaylistHash = (spaceId: string) => {
  const response = useFetch<any>(window._env_.BACKEND_ENDPOINT_URL + `/space-playlist/` + spaceId, {
    fetchPolicy: 'cache-and-network'
  });
  return response;
};
