import {useFetch} from './useApi';

export const useSpaceType = (spaceId: string | undefined) => {
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  return useFetch<string[]>(window._env_.BACKEND_ENDPOINT_URL + `/space-type/${spaceId}`, {
    fetchPolicy: 'cache-and-network'
  });
};
