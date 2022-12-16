import {RequestInterface} from '@momentum-xyz/core';
import {generatePath} from 'react-router-dom';

import {request} from 'api/request';

import {assets3dRepositoryEndpoints} from './assets3dRepository.api.endpoints';
import {
  DeleteAssets3dRequest,
  DeleteAssets3dResponse,
  FetchAssets3dRequest,
  FetchAssets3dResponse,
  UploadAsset3dRequest,
  UploadAsset3dResponse
} from './assets3dRepository.api.types';

export const upload3DAsset: RequestInterface<UploadAsset3dRequest, UploadAsset3dResponse> = (
  options
) => {
  const {asset, name, headers, worldId, ...restOptions} = options;

  const formData: FormData = new FormData();
  formData.append('asset', asset);
  formData.append('name', name);

  const requestOptions = {
    headers: {
      'Content-Type': 'multipart/form-data',
      ...headers
    },
    ...restOptions
  };

  const url = generatePath(assets3dRepositoryEndpoints().upload, {worldId});

  return request.post(url, formData, requestOptions);
};

export const delete3DAssets: RequestInterface<DeleteAssets3dRequest, DeleteAssets3dResponse> = (
  options
) => {
  const {assets3dIDs, worldId, ...restOptions} = options;

  restOptions.data = {
    assets3dIDs
  };

  const url = generatePath(assets3dRepositoryEndpoints().base, {worldId});

  return request.delete(url, restOptions);
};

export const fetchAssets3d: RequestInterface<FetchAssets3dRequest, FetchAssets3dResponse> = (
  options
) => {
  const {category, worldId, ...restOptions} = options;

  restOptions.params = {
    category
  };

  const url = generatePath(assets3dRepositoryEndpoints().base, {worldId});

  return request.get(url, restOptions);
};
