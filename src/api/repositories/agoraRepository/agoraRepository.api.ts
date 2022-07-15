import {appVariables} from 'api/constants';
import {RequestInterface} from 'api/interfaces';
import {request} from 'api/request';

import {AgoraTokenRequest, AgoraTokenResponse} from './agoraRepository.api.types';

export const getAgoraToken: RequestInterface<AgoraTokenRequest, AgoraTokenResponse> = (options) => {
  const {isStageMode, spaceId, ...restOptions} = options;

  const url = `${appVariables.BACKEND_ENDPOINT_URL}/agora/token/${
    isStageMode ? 'stage-' : ''
  }${spaceId}`;

  return request.get(url, restOptions);
};
