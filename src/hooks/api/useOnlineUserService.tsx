import {useCallback} from 'react';

import {request} from 'api/request';
import {appVariables} from 'api/constants';

import {SpaceCheckResponse} from '../../context/type/Space';

import {useFetch} from './useApi';

export const useGetTable = (userId: string) => {
  return useFetch<SpaceCheckResponse>(
    appVariables.BACKEND_ENDPOINT_URL + `/tables/find/${userId}`,
    {
      fetchPolicy: 'network-only'
    }
  );
};

export const useOnlineUserSpaceCheck = () => {
  const userSpaceCheck = useCallback(async (userId: string) => {
    const response: boolean = await request.get(
      appVariables.BACKEND_ENDPOINT_URL + `/online-user/check/${userId}`
    );

    return response;
  }, []);

  return userSpaceCheck;
};

export const useGetOnlineUserSpace = () => {
  const onlineUserSpace = useCallback(async (userId: string) => {
    const response: any = await request.get(
      appVariables.BACKEND_ENDPOINT_URL + `/online-user/space/${userId}`
    );

    return response;
  }, []);

  return onlineUserSpace;
};
