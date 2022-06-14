import {useCallback} from 'react';

import {request} from 'api/request';
import {appVariables} from 'api/constants';

export const useGetUserOwnedSpaces = () => {
  return useCallback(async (currentWorldId) => {
    return request.get(
      appVariables.BACKEND_ENDPOINT_URL + `/space/owned-spaces`,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      currentWorldId && {
        params: {world: currentWorldId}
      }
    );
  }, []);
};
