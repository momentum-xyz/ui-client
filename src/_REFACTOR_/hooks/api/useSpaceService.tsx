import {appVariables} from 'api/constants';

import {SpaceResponse} from '../../context/type/Space';

import {useFetch} from './useApi';

export const useGetSpace = (id: string) => {
  return useFetch<SpaceResponse>(appVariables.BACKEND_ENDPOINT_URL + `/space/user/${id}`, {
    fetchPolicy: 'network-only'
  });
};
