import {RequestInterface} from '@momentum-xyz/core';
import {generatePath} from 'react-router-dom';

import {request} from 'api/request';

import {assetsRepositoryEndpoints} from './assetsRepository.api.endpoints';
import {Asset2DRequest, Asset2DResponse} from './assetsRepository.api.types';

export const get2DAsset: RequestInterface<Asset2DRequest, Asset2DResponse> = (options) => {
  const {assetId, ...restOptions} = options;

  const url = generatePath(assetsRepositoryEndpoints().asset, {assetId});

  return request.get(url, restOptions);
};
