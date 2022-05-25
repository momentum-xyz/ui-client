import {RequestInterface} from 'api/interfaces';
import {request} from 'api/request';

import {StageModeRequest, StageModeResponse} from './stageModeRepository.api.types';
import {stageModeRepositoryEndpoints} from './stageModeRepository.api.endpoints';

export const leaveStageMode: RequestInterface<StageModeRequest, StageModeResponse> = (options) => {
  const {spaceId, ...restOptions} = options;
  const url = stageModeRepositoryEndpoints().leave(spaceId);

  return request.post(url, restOptions);
};

export const joinStageMode: RequestInterface<StageModeRequest, StageModeResponse> = (options) => {
  const {spaceId, ...restOptions} = options;
  const url = stageModeRepositoryEndpoints().join(spaceId);

  return request.post<StageModeResponse>(url, restOptions);
};
