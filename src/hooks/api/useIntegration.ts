import {BroadcastDTO} from '../../context/type/Broadcast';

import {useFetch, usePost} from './useApi';

export const useBroadcast = (id: string) => {
  const response = useFetch<BroadcastDTO>(window._env_.BACKEND_ENDPOINT_URL + `/broadcast/${id}`, {
    fetchPolicy: 'cache-and-network'
  });
  return response;
};

export const useUpdateBroadcast = () => {
  return usePost<BroadcastDTO, BroadcastDTO>(
    window._env_.BACKEND_ENDPOINT_URL + `/broadcast/create`
  );
};
