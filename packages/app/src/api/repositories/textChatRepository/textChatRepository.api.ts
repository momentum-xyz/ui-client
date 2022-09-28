import {request} from 'api/request';
import {RequestInterface} from 'api/interfaces';

import {TextChatTokenRequest, TextChatTokenResponse} from './textChatRepository.api.types';
import {textChatRepositoryApiEndpoints} from './textChatRepository.api.endpoints';

export const getTextChatToken: RequestInterface<TextChatTokenRequest, TextChatTokenResponse> = (
  options
) => {
  const url = textChatRepositoryApiEndpoints().token;

  return request.get(url, options);
};
