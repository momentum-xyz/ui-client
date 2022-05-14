import {useCallback} from 'react';

import {request} from 'api/request';

export const useCreateUserAvatar = () => {
  return useCallback(async (data) => {
    return request.post(window._env_.BACKEND_ENDPOINT_URL + `/users/avatar/upload`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }, []);
};

export const useGetUserAvatar = () => {
  return useCallback(async (userhash: string) => {
    return request.get(window._env_.RENDER_SERVICE_URL + `/get/${userhash}`);
  }, []);
};
