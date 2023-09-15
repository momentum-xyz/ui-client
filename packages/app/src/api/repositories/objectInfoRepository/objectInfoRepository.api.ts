import {RequestInterface} from '@momentum-xyz/core';
import {generatePath} from 'react-router-dom';

import {request} from 'api/request';

import {objectInfoRepository} from './objectInfoRepository.api.endpoints';
import {
  GetObjectInfoRequest,
  GetObjectInfoResponse,
  PatchObjectInfoRequest,
  PatchObjectInfoResponse
} from './objectInfoRepository.api.types';

export const getObjectInfo: RequestInterface<GetObjectInfoRequest, GetObjectInfoResponse> = (
  options
) => {
  const {objectId, ...restOptions} = options;

  const url = generatePath(objectInfoRepository().object, {objectId});

  return request.get(url, restOptions);
};

export const patchObjectInfo: RequestInterface<PatchObjectInfoRequest, PatchObjectInfoResponse> = (
  options
) => {
  const {objectId, asset_2d_id, asset_3d_id, object_type_id, ...restOptions} = options;

  const url = generatePath(objectInfoRepository().object, {objectId});

  return request.patch(url, {asset_2d_id, asset_3d_id, object_type_id}, restOptions);
};
