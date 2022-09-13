import {generatePath} from 'react-router-dom';

import {RequestInterface} from 'api/interfaces';
import {request} from 'api/request';
import {bytesToUuid} from 'core/utils';

import {emojiRepositoryEndpoints} from './emojiRepository.api.endpoints';
import {
  EmojiConfigLegacyResponse,
  EmojiConfigRequest,
  EmojiConfigResponse
} from './emojiRepository.api.types';

export const fetchSpaceEmojiConfig: RequestInterface<
  EmojiConfigRequest,
  EmojiConfigResponse
> = async (options) => {
  const {worldId, ...restOptions} = options;

  const url = generatePath(emojiRepositoryEndpoints().spaceEmojiConfig, {worldId});

  const resp = await request.get(url, restOptions);

  // temp support for legacy format
  // FIXME remove after October 2022
  const testSample = (resp.data as EmojiConfigLegacyResponse)[0];
  if (typeof testSample?.emoji === 'object') {
    console.log(
      'LEGACY emoji format detected. Convert to newer one. Original:',
      JSON.stringify(resp.data)
    );
    resp.data = (resp.data as EmojiConfigLegacyResponse).map(
      ({emoji, emojiId, order, spaceId}) => ({
        ...emoji,
        id: bytesToUuid(emojiId.data),
        order,
        spaceId: bytesToUuid(spaceId.data)
      })
    );
    console.log('Converted emoji data:', JSON.stringify(resp.data));
  }

  return resp;
};
