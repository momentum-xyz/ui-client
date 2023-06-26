import {RequestInterface} from 'api/interfaces';
import {request} from 'api/request';

import {UploadFileRequest, UploadFileResponse} from './mediaRepository.api.types';
import {mediaRepositoryEndpoints} from './mediaRepository.api.endpoints';

export const uploadImage: RequestInterface<UploadFileRequest, UploadFileResponse> = (options) => {
  const {file, headers, ...restOptions} = options;

  const formData: FormData = new FormData();
  formData.append('file', file);

  const requestOptions = {
    headers: {
      'Content-Type': 'multipart/form-data',
      ...headers
    },
    ...restOptions
  };

  return request.post(mediaRepositoryEndpoints().uploadImage, formData, requestOptions);
};

export const uploadVideo: RequestInterface<UploadFileRequest, UploadFileResponse> = (options) => {
  const {file, headers, ...restOptions} = options;

  const formData: FormData = new FormData();
  formData.append('file', file);

  const requestOptions = {
    headers: {
      'Content-Type': 'multipart/form-data',
      ...headers
    },
    ...restOptions
  };

  return request.post(mediaRepositoryEndpoints().uploadVideo, formData, requestOptions);
};

export const uploadAudio: RequestInterface<UploadFileRequest, UploadFileResponse> = (options) => {
  const {file, headers, ...restOptions} = options;

  const formData: FormData = new FormData();
  formData.append('file', file);

  const requestOptions = {
    headers: {
      'Content-Type': 'multipart/form-data',
      ...headers
    },
    ...restOptions
  };

  return request.post(mediaRepositoryEndpoints().uploadAudio, formData, requestOptions);
};
