import {RequestInterface} from '@momentum-xyz/core';

import {request} from 'api/request';

import {assets3DEndpoints} from './assets3DRepository.api.endpoints';
import {GetAssets3DRequest, GetAssets3DResponse} from './assets3DRepository.api.types';

export const getAssets3DList: RequestInterface<GetAssets3DRequest, GetAssets3DResponse> = () => {
  // const {worldId} = options;

  return request.get(assets3DEndpoints().assets3D, {});
};
