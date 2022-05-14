import {Profile, ProfileEditDTO, ProfileEditResponse} from '../../context/type/Profile';

import {useFetch, usePut} from './useApi';

export const useEditProfile = () =>
  usePut<ProfileEditResponse, ProfileEditDTO>(window._env_.BACKEND_ENDPOINT_URL + '/profile/edit');

export const useProfile = (userId: string) =>
  useFetch<Profile>(window._env_.BACKEND_ENDPOINT_URL + `/profile/${userId}`, {
    fetchPolicy: 'network-only'
  });
