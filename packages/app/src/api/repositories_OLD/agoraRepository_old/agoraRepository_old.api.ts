import {generatePath} from 'react-router-dom';

import {RequestInterface} from 'api/interfaces';
import {request} from 'api/request';

import {agoraRepositoryApiEndpoints_old} from './agoraRepository_old.api.endpoints';
import {
  AgoraTokenRequest,
  AgoraTokenResponse,
  RelayScreenShareRequest,
  RelayScreenShareResponse
} from './agoraRepository_old.api.types';

export const getAgoraToken: RequestInterface<AgoraTokenRequest, AgoraTokenResponse> = (options) => {
  const {isStageMode, spaceId, ...restOptions} = options;

  const url = generatePath(agoraRepositoryApiEndpoints_old().token, {
    channelId: isStageMode ? `stage-${spaceId}` : spaceId
  });

  return request.get(url, restOptions);
};

export const getAgoraScreenShareToken: RequestInterface<AgoraTokenRequest, AgoraTokenResponse> = (
  options
) => {
  const {isStageMode, spaceId, ...restOptions} = options;

  const url = generatePath(agoraRepositoryApiEndpoints_old().tokenScreenshare, {
    channelId: isStageMode ? `stage-${spaceId}` : spaceId
  });

  return request.get(url, restOptions);
};

export const relayScreenShare: RequestInterface<
  RelayScreenShareRequest,
  RelayScreenShareResponse
> = (options) => {
  const {spaceId, ...restOptions} = options;

  const url = generatePath(agoraRepositoryApiEndpoints_old().relayScreenShare, {spaceId});

  return request.post(url, restOptions);
};
