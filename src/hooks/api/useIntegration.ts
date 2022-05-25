import {BroadcastDTO} from '../../context/type/Broadcast';
import {appVariables} from '../../api/constants';

import {useFetch, usePost} from './useApi';

export const useBroadcast = (id: string) => {
  const response = useFetch<BroadcastDTO>(appVariables.BACKEND_ENDPOINT_URL + `/broadcast/${id}`, {
    fetchPolicy: 'cache-and-network'
  });
  return response;
};

export const useUpdateBroadcast = () => {
  return usePost<BroadcastDTO, BroadcastDTO>(
    appVariables.BACKEND_ENDPOINT_URL + `/broadcast/create`
  );
};
