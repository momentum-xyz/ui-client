import {generatePath} from 'react-router-dom';

import {RequestInterface} from 'api/interfaces';
import {request} from 'api/request';

import {agoraRepositoryApiEndpoints} from './agoraRepository.api.endpoints';
import {AgoraTokenRequest, AgoraTokenResponse} from './agoraRepository.api.types';

export const getAgoraToken: RequestInterface<AgoraTokenRequest, AgoraTokenResponse> = (options) => {
  const {isStageMode, spaceId, ...restOptions} = options;

  const url = generatePath(agoraRepositoryApiEndpoints().token, {
    channelId: isStageMode ? `stage-${spaceId}` : spaceId
  });

  return request.get(url, restOptions);
};

export const getAgoraScreenShareToken: RequestInterface<AgoraTokenRequest, AgoraTokenResponse> = (
  options
) => {
  const {isStageMode, spaceId, ...restOptions} = options;

  const url = generatePath(agoraRepositoryApiEndpoints().tokenScreenshare, {
    channelId: isStageMode ? `stage-${spaceId}` : spaceId
  });

  return request.get(url, restOptions);
};
