import {RequestInterface} from 'api/interfaces';
import {request} from 'api/request';

import {resourcesRepositoryApiEndpoints} from './resourcesRepository.api.endpoints';
import {ImageUploadRequest} from './resourcesRepository.types';

export const uploadTileImage: RequestInterface<ImageUploadRequest, string> = (options) => {
  const {file, ...restOptions} = options;
  const formData: FormData = new FormData();
  formData.append('file', file);
  const requestParams = {
    ...restOptions,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  };
  const url = resourcesRepositoryApiEndpoints().upload;
  return request.post(url, formData, requestParams);
};
