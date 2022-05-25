import {useCallback} from 'react';

import {request} from 'api/request';
import {appVariables} from 'api/constants';

export const useCreateUserAvatar = () => {
  return useCallback(async (data) => {
    return request.post(appVariables.BACKEND_ENDPOINT_URL + `/users/avatar/upload`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }, []);
};

export const useGetUserAvatar = () => {
  return useCallback(async (userhash: string) => {
    return request.get(appVariables.RENDER_SERVICE_URL + `/get/${userhash}`);
  }, []);
};
