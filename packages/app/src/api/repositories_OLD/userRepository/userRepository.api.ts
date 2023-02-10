import {request} from 'api/request';
import {RequestInterface} from 'api/interfaces';

import {ProfileRequest, ProfileResponse} from './userRepository.api.types';
import {userRepositoryEndpoints} from './userRepository.api.endpoints';

export const fetchProfile: RequestInterface<ProfileRequest, ProfileResponse> = (options) => {
  const {userId, ...restOptions} = options;
  const URL = `${userRepositoryEndpoints().profile}/${userId}`;

  return request.get(URL, restOptions);
};
