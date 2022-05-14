import {Team} from '../../context/type/Team';

import {useFetch} from './useApi';

export const useTeam = (id: string) => {
  const response = useFetch<Team>(window._env_.BACKEND_ENDPOINT_URL + `/projects/${id}`, {
    fetchPolicy: 'cache-and-network'
  });
  return response;
};
