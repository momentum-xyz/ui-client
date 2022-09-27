import {generatePath} from 'react-router-dom';

import {request} from 'api/request';
import {RequestInterface} from 'api/interfaces';

import {StreamChatTokenRequest, StreamChatTokenResponse} from './streamChatRepository.api.types';
import {streamChatRepositoryApiEndpoints} from './streamChatRepository.api.endpoints';

export const getStreamChatToken: RequestInterface<
  StreamChatTokenRequest,
  StreamChatTokenResponse
> = (options) => {
  const {spaceId, ...restOptions} = options;
  const path = generatePath(streamChatRepositoryApiEndpoints().token, {spaceId});
  const url = `${streamChatRepositoryApiEndpoints().baseURL}/${path}`;

  return request.get(url, restOptions);
};
