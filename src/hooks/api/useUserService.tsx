import {UserSearchResults} from '../../context/type/User';

import {useFetch, usePost} from './useApi';

export interface InviteUserByEmailDTO {
  email: string;
  isAdmin: boolean;
  spaceId: string;
}

export const useFindUser = (query: string) => {
  return useFetch<UserSearchResults>(
    window._env_.BACKEND_ENDPOINT_URL + `/users/search?q=${query}`,
    {
      fetchPolicy: 'network-only'
    }
  );
};

export const useInviteUserToSpace = () => {
  return usePost<InviteUserByEmailDTO, InviteUserByEmailDTO>(
    window._env_.BACKEND_ENDPOINT_URL + '/users/invite'
  );
};
