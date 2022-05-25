import {appVariables} from 'api/constants';

import {useFetch} from './useApi';

export const usePlaylistHash = (spaceId: string) => {
  const response = useFetch<any>(appVariables.BACKEND_ENDPOINT_URL + `/space-playlist/` + spaceId, {
    fetchPolicy: 'cache-and-network'
  });
  return response;
};
