import {UserSearchResults} from '../../context/type/User';
import {appVariables} from '../../api/constants';

import {useFetch} from './useApi';

export const useFindUser = (query: string) => {
  return useFetch<UserSearchResults>(
    appVariables.BACKEND_ENDPOINT_URL + `/users/search?q=${query}`,
    {
      fetchPolicy: 'network-only'
    }
  );
};
