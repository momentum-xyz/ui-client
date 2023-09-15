import {generatePath} from 'react-router-dom';

import {RequestInterface} from 'api/interfaces';
import {request} from 'api/request';

import {agoraRepositoryApiEndpoints} from './agoraRepository.api.endpoints';
import {AgoraTokenRequest, AgoraTokenResponse} from './agoraRepository.api.types';

export const getAgoraToken: RequestInterface<AgoraTokenRequest, AgoraTokenResponse> = (options) => {
  const {objectId, screenshare, ...restOptions} = options;

  const url = generatePath(agoraRepositoryApiEndpoints().token, {objectId});

  return request.post(url, {screenshare}, restOptions);
};
