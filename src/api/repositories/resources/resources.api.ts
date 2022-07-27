import {RequestInterface} from '../../interfaces';
import {request} from '../../request';

import {resourcesApiEndpoints} from './resources.api.endpoints';
import {ImageUploadRequest, ImageUploadResponse} from './resources.types';

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
  const url = resourcesApiEndpoints().upload;
  return request.post(url, formData, requestParams);
};
