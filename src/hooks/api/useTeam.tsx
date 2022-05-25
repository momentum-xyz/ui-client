import {Team} from '../../context/type/Team';
import {appVariables} from '../../api/constants';

import {useFetch} from './useApi';

export const useTeam = (id: string) => {
  const response = useFetch<Team>(appVariables.BACKEND_ENDPOINT_URL + `/projects/${id}`, {
    fetchPolicy: 'cache-and-network'
  });
  return response;
};
