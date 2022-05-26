import {appVariables} from 'api/constants';

import {
  SpaceDTO,
  SpaceResponse,
  SpaceUserResponse,
  Space,
  SpaceCreateResponse
} from '../../context/type/Space';
import {SearchResults} from '../../context/type/Search';

import {promiseFetch, useFetch, usePost, usePut} from './useApi';

export interface SpaceSettingsDto {
  parentId: string;
  root: boolean;
  name: string;
  description: string;
  secret: number;
}

export interface User {
  id: {
    type: string;
    data: Buffer;
  };
  uuid?: string;
  name: string;
  isAdmin?: boolean;
}

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

export const usePutSpace = (id: string) => {
  return usePut<SpaceSettingsDto, SpaceSettingsDto>(
    appVariables.BACKEND_ENDPOINT_URL + `/space/edit/${id}`
  );
};

export const useAssignUserToSpace = () => {
  return usePost<AssignUserDTO, AssignUserDTO>(
    appVariables.BACKEND_ENDPOINT_URL + `/space/assign-user`
  );
};

export const useUnAssignUserToSpace = () => {
  return usePost<AssignUserDTO, AssignUserDTO>(
    appVariables.BACKEND_ENDPOINT_URL + `/space/unassign-user`
  );
};

export const useSpaceUsers = (id: string) => {
  return useFetch<SpaceUserResponse>(appVariables.BACKEND_ENDPOINT_URL + `/space/${id}/users`, {
    fetchPolicy: 'cache-and-network'
  });
};

export const useSpaceSearch = () => {
  return (searchQuery: string, worldId: string) =>
    promiseFetch<SearchResults<Space>>(
      appVariables.BACKEND_ENDPOINT_URL + `/space/search?q=${searchQuery}&worldId=${worldId}`,
      {},
      'network-only'
    );
};
