import {Track} from '../../context/type/TrackDashboard';

import {useFetch} from './useApi';

export const useTrack = (id: string) => {
  return useFetch<Track>(`/tracks/${id}/dashboard`, {
    fetchPolicy: 'network-only',
    lazy: true
  });
};
