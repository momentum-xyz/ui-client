import {RequestInterface} from '@momentum-xyz/core';
import {generatePath} from 'react-router-dom';

import {request} from 'api/request';

import {spaceInfoRepository} from './spaceInfoRepository.api.endpoints';
import {GetSpaceInfoRequest, GetSpaceInfoResponse} from './spaceInfoRepository.api.types';

export const getSpaceInfo: RequestInterface<GetSpaceInfoRequest, GetSpaceInfoResponse> = (
  options
) => {
  const {spaceId, ...restOptions} = options;

  const url = generatePath(spaceInfoRepository().spaceInfo, {spaceId});

  return request.get(url, restOptions);
};
