import {generatePath} from 'react-router-dom';

import {request} from 'api/request';
import {RequestInterface} from 'api/interfaces';

import {
  StreamChatRequest,
  StreamChatResponse,
  StreamChatTokenResponse
} from './streamChatRepository.api.types';
import {streamChatRepositoryApiEndpoints} from './streamChatRepository.api.endpoints';

export const getStreamChatToken: RequestInterface<StreamChatRequest, StreamChatTokenResponse> = (
  options
) => {
  const {spaceId, ...restOptions} = options;
  const path = generatePath(streamChatRepositoryApiEndpoints().token, {spaceId});
  const url = `${streamChatRepositoryApiEndpoints().baseURL}/${path}`;

  return request.post(url, restOptions);
};

export const leave: RequestInterface<StreamChatRequest, StreamChatResponse> = (options) => {
  const {spaceId, ...restOptions} = options;
  const path = generatePath(streamChatRepositoryApiEndpoints().leave, {spaceId});
  const url = `${streamChatRepositoryApiEndpoints().baseURL}/${path}`;

  return request.post(url, restOptions);
};
