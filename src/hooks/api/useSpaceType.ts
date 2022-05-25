import {appVariables} from 'api/constants';

import {useFetch} from './useApi';

export const useSpaceType = (spaceId: string | undefined) => {
  return useFetch<string[]>(appVariables.BACKEND_ENDPOINT_URL + `/space-type/${spaceId}`, {
    fetchPolicy: 'cache-and-network'
  });
};
