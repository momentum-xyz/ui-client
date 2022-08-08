import {request} from 'api/request';
import {RequestInterface} from 'api/interfaces';

import {agoraRepositoryApiEndpoints} from '../agoraRepository/agoraRepository.api.endpoints';

import {TextChatTokenRequest, TextChatTokenResponse} from './textChatRepository.api.types';

export const getTextChatToken: RequestInterface<TextChatTokenRequest, TextChatTokenResponse> = (
  options
) => {
  const url = agoraRepositoryApiEndpoints().token;

  return request.get(url, options);
};
