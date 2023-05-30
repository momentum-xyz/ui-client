import {generatePath} from 'react-router-dom';

import {RequestInterface} from 'api/interfaces';
import {request} from 'api/request';
import {bytesToUuid} from 'core/utils';

import {spaceEmojiRepositoryEndpoints} from './spaceEmojiRepository.api.endpoints';
import {
  AssignEmojiToSpaceRequest,
  AssignEmojiToSpaceResponse,
  WorldEmojiesLegacyResponse,
  WorldEmojiesRequest,
  WorldEmojiesResponse,
  SpaceEmojiesRequest,
  SpaceEmojiesResponse
} from './spaceEmojiRepository.api.types';

export const fetchWorldEmojies: RequestInterface<WorldEmojiesRequest, WorldEmojiesResponse> =
  async (options) => {
    const {worldId, ...restOptions} = options;

    const url = generatePath(spaceEmojiRepositoryEndpoints().worldEmojiList, {worldId});

    const resp = await request.get(url, {...restOptions, params: {children: true}});

    // temp support for legacy format
    // FIXME remove after October 2022
    const testSample = (resp.data as WorldEmojiesLegacyResponse)[0];
    if (typeof testSample?.emoji === 'object') {
      resp.data = (resp.data as WorldEmojiesLegacyResponse).map(
        ({emoji, emojiId, order, spaceId}) => ({
          ...emoji,
          id: bytesToUuid(emojiId.data),
          order,
          spaceId: bytesToUuid(spaceId.data)
        })
      );
    }

    return resp;
  };

export const fetchSpaceEmoji: RequestInterface<SpaceEmojiesRequest, SpaceEmojiesResponse> = async (
  options
) => {
  const {spaceId, ...restOptions} = options;

  const url = generatePath(spaceEmojiRepositoryEndpoints().spaceEmojiList, {spaceId});

  const resp = await request.get(url, {...restOptions, params: {children: true}});

  // temp support for legacy format
  // FIXME remove after October 2022
  const testSample = (resp.data as WorldEmojiesLegacyResponse)[0];
  if (typeof testSample?.emoji === 'object') {
    resp.data = (resp.data as WorldEmojiesLegacyResponse).map(
      ({emoji, emojiId, order, spaceId}) => ({
        ...emoji,
        id: bytesToUuid(emojiId.data),
        order,
        spaceId: bytesToUuid(spaceId.data)
      })
    );
  }

  return resp;
};

export const assignEmojiToSpace: RequestInterface<
  AssignEmojiToSpaceRequest,
  AssignEmojiToSpaceResponse
> = (options) => {
  const {emojiId, spaceId, ...restOptions} = options;
  const url = spaceEmojiRepositoryEndpoints().emojiAddToSpace;

  return request.post(url, {emojiId, spaceId}, restOptions);
};
