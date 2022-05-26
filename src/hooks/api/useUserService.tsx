import {UserSearchResults} from '../../context/type/User';
import {appVariables} from '../../api/constants';

import {useFetch, usePost} from './useApi';

export interface InviteUserByEmailDTO {
  email: string;
  isAdmin: boolean;
  spaceId: string;
}

export const useFindUser = (query: string) => {
  return useFetch<UserSearchResults>(
    appVariables.BACKEND_ENDPOINT_URL + `/users/search?q=${query}`,
    {
      fetchPolicy: 'network-only'
    }
  );
};

export const useInviteUserToSpace = () => {
  return usePost<InviteUserByEmailDTO, InviteUserByEmailDTO>(
    appVariables.BACKEND_ENDPOINT_URL + '/users/invite'
  );
};
