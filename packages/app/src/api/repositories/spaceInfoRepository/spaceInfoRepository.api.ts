import {RequestInterface} from '@momentum-xyz/core';
import {generatePath} from 'react-router-dom';

import {request} from 'api/request';

import {spaceInfoRepository} from './spaceInfoRepository.api.endpoints';
import {
  GetSpaceInfoRequest,
  GetSpaceInfoResponse,
  PatchSpaceInfoRequest,
  PatchSpaceInfoResponse
} from './spaceInfoRepository.api.types';

export const getSpaceInfo: RequestInterface<GetSpaceInfoRequest, GetSpaceInfoResponse> = (
  options
) => {
  const {spaceId, ...restOptions} = options;

  const url = generatePath(spaceInfoRepository().spaceInfo, {spaceId});

  return request.get(url, restOptions);
};

export const patchSpaceInfo: RequestInterface<PatchSpaceInfoRequest, PatchSpaceInfoResponse> = (
  options
) => {
  const {spaceId, asset_2d_id, asset_3d_id, object_type_id, ...restOptions} = options;

  const url = generatePath(spaceInfoRepository().spaceInfo, {spaceId});

  return request.patch(url, {asset_2d_id, asset_3d_id, object_type_id}, restOptions);
};
