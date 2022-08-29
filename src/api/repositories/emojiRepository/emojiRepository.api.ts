import {generatePath} from 'react-router-dom';

import {RequestInterface} from 'api/interfaces';
import {request} from 'api/request';

import {emojiRepositoryEndpoints} from './emojiRepository.api.endpoints';
import {EmojiConfigRequest, EmojiConfigResponse} from './emojiRepository.api.types';

export const fetchSpaceEmojiConfig: RequestInterface<EmojiConfigRequest, EmojiConfigResponse> = (
  options
) => {
  const {worldId, ...restOptions} = options;

  const url = generatePath(emojiRepositoryEndpoints().spaceEmojiConfig, {worldId});

  return request.get(url, restOptions);
};
