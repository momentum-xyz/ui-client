import {RequestInterface} from '@momentum-xyz/core';

import {request} from 'api/request';

import {assets3dRepositoryEndpoints} from './assets3dRepository.api.endpoints';
import {
  FetchAssets3dResponse,
  UploadAsset3dRequest,
  UploadAsset3dResponse
} from './assets3dRepository.api.types';

export const upload3DAsset: RequestInterface<UploadAsset3dRequest, UploadAsset3dResponse> = (
  options
) => {
  const {asset, headers, ...restOptions} = options;

  const formData: FormData = new FormData();
  formData.append('asset', asset);

  const requestOptions = {
    headers: {
      'Content-Type': 'multipart/form-data',
      ...headers
    },
    ...restOptions
  };

  return request.post(assets3dRepositoryEndpoints().upload, formData, requestOptions);
};

export const fetchAssets3d: RequestInterface<null, FetchAssets3dResponse> = () => {
  return request.get(assets3dRepositoryEndpoints().base, {params: {category: 'skybox'}});
};
