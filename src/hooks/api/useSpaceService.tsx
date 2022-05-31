import {appVariables} from 'api/constants';

import {SpaceDTO, SpaceResponse, SpaceCreateResponse} from '../../context/type/Space';

import {useFetch, usePost} from './useApi';

export interface AssignUserDTO {
  userId: string;
  isAdmin: boolean;
  spaceId: string;
}

export const useGetSpace = (id: string) => {
  return useFetch<SpaceResponse>(appVariables.BACKEND_ENDPOINT_URL + `/space/user/${id}`, {
    fetchPolicy: 'network-only'
  });
};

export const usePostSpace = () => {
  return usePost<SpaceCreateResponse, SpaceDTO>(
    appVariables.BACKEND_ENDPOINT_URL + `/space/create`
  );
};
