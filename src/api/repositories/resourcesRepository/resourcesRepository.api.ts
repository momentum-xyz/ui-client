import {RequestInterface} from 'api/interfaces';
import {request} from 'api/request';

import {resourcesRepositoryApiEndpoints} from './resourcesRepository.api.endpoints';
import {ImageUploadRequest, ImageUploadResponse} from './resourcesRepository.types';

export const uploadTileImage: RequestInterface<ImageUploadRequest, ImageUploadResponse> = (
  options
) => {
  const {file, ...restOptions} = options;
  const formData: FormData = new FormData();
  formData.append('file', file);
  const requestParams = {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    ...restOptions
  };
  const url = resourcesRepositoryApiEndpoints().upload;
  return request.post(url, formData, requestParams);
};
