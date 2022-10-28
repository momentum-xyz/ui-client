import {request} from 'api/request';
import {RequestInterface} from 'api/interfaces';

import {UploadAvatarRequest, UploadAvatarResponse} from './profileRepository.api.types';
import {userRepositoryEndpoints} from './profileRepository.api.endpoints';

export const uploadAvatar: RequestInterface<UploadAvatarRequest, UploadAvatarResponse> = (
  options
) => {
  const {avatar, headers, ...restOptions} = options;

  const formData: FormData = new FormData();
  formData.append('avatar', avatar);

  const requestParams = {
    headers: {
      'Content-Type': 'multipart/form-data',
      ...headers
    },
    ...restOptions
  };

  const URL = `${userRepositoryEndpoints().avatarUpload}`;
  return request.post(URL, formData, requestParams);
};
