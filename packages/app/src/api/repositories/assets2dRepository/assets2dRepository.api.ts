import {RequestInterface} from '@momentum-xyz/core';
import {generatePath} from 'react-router-dom';

import {request} from 'api/request';

import {assets2dRepositoryEndpoints} from './assets2dRepository.api.endpoints';
import {Asset2dRequest, Asset2dResponse} from './assets2dRepository.api.types';

export const get2dAsset: RequestInterface<Asset2dRequest, Asset2dResponse> = (options) => {
  const {assetId, ...restOptions} = options;

  const url = generatePath(assets2dRepositoryEndpoints().asset, {assetId});

  return request.get(url, restOptions);
};
