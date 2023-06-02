import {RequestInterface} from '@momentum-xyz/core';
import {generatePath} from 'react-router-dom';

import {request} from 'api/request';

import {assets3dRepositoryEndpoints} from './assets3dRepository.api.endpoints';
import {
  FetchAssets3dRequest,
  FetchAssets3dResponse,
  PatchAsset3dRequest,
  UploadAsset3dRequest,
  UploadAsset3dResponse,
  Asset3dInterface
} from './assets3dRepository.api.types';

export const upload3DAsset: RequestInterface<UploadAsset3dRequest, UploadAsset3dResponse> = (
  options
) => {
  const {asset, name, headers, worldId, preview_hash, is_private, ...restOptions} = options;

  const formData: FormData = new FormData();
  formData.append('asset', asset);
  formData.append('name', name);
  if (preview_hash) {
    formData.append('preview_hash', preview_hash);
  }
  if (is_private) {
    formData.append('is_private', is_private.toString());
  }

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

export const patchAssets3dMetadata: RequestInterface<PatchAsset3dRequest, Asset3dInterface> = (
  options
) => {
  const {worldId, assetId, name, preview_hash, ...restOptions} = options;

  const url = generatePath(assets3dRepositoryEndpoints().patchMeta, {worldId, assetId});

  return request.patch(url, {meta: {name, preview_hash}}, restOptions);
};
