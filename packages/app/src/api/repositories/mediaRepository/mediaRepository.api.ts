import {RequestInterface} from 'api/interfaces';
import {request} from 'api/request';

import {UploadImageRequest, UploadImageResponse} from './mediaRepository.api.types';
import {mediaRepositoryEndpoints} from './mediaRepository.api.endpoints';

export const uploadImage: RequestInterface<UploadImageRequest, UploadImageResponse> = (options) => {
  const {file, headers, ...restOptions} = options;
  const url = mediaRepositoryEndpoints().uploadImage;

  const formData: FormData = new FormData();
  formData.append('file', file);

  const requestOptions = {
    headers: {
      'Content-Type': 'multipart/form-data',
      ...headers
    },
    ...restOptions
  };

  return request.post(url, formData, requestOptions);
};
