import {generatePath} from 'react-router-dom';

import {request} from 'api/request';
import {RequestInterface} from 'api/interfaces';

import {StreamChatRequest, StreamChatTokenResponse} from './streamChatRepository.api.types';
import {streamChatRepositoryApiEndpoints} from './streamChatRepository.api.endpoints';

export const getStreamChatToken: RequestInterface<StreamChatRequest, StreamChatTokenResponse> = (
  options
) => {
  const {spaceId, ...restOptions} = options;
  const url = generatePath(streamChatRepositoryApiEndpoints().token, {spaceId});
  return request.post(url, restOptions);
};
