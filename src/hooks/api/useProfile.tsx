import {appVariables} from 'api/constants';

import {Profile, ProfileEditDTO, ProfileEditResponse} from '../../context/type/Profile';

import {useFetch, usePut} from './useApi';

export const useEditProfile = () =>
  usePut<ProfileEditResponse, ProfileEditDTO>(appVariables.BACKEND_ENDPOINT_URL + '/profile/edit');

export const useProfile = (userId: string) =>
  useFetch<Profile>(appVariables.BACKEND_ENDPOINT_URL + `/profile/${userId}`, {
    fetchPolicy: 'network-only'
  });
