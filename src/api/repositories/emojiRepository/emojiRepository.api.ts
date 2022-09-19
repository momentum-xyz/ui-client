import {generatePath} from 'react-router-dom';

import {RequestInterface} from 'api/interfaces';
import {request} from 'api/request';
import {bytesToUuid} from 'core/utils';

import {emojiRepositoryEndpoints} from './emojiRepository.api.endpoints';
import {
  AssignEmojiToSpaceRequest,
  AssignEmojiToSpaceResponse,
  DeleteEmojiRequest,
  DeleteEmojiResponse,
  WorldEmojiesLegacyResponse,
  WorldEmojiesRequest,
  WorldEmojiesResponse,
  UploadEmojiRequest,
  UploadEmojiResponse,
  SpaceEmojiesRequest,
  SpaceEmojiesResponse
} from './emojiRepository.api.types';

export const fetchWorldEmojies: RequestInterface<
  WorldEmojiesRequest,
  WorldEmojiesResponse
> = async (options) => {
  const {worldId, ...restOptions} = options;

  const url = generatePath(emojiRepositoryEndpoints().worldEmojiList, {worldId});

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

  const url = generatePath(emojiRepositoryEndpoints().spaceEmojiList, {spaceId});

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

export const uploadEmoji: RequestInterface<UploadEmojiRequest, UploadEmojiResponse> = (options) => {
  const {spaceId, file, name, headers, ...restOptions} = options;
  const url = generatePath(emojiRepositoryEndpoints().emojiUpload, {spaceId});

  const formData: FormData = new FormData();
  formData.append('file', file);
  formData.append('name', name);

  const requestOptions = {
    headers: {
      'Content-Type': 'multipart/form-data',
      ...headers
    },
    ...restOptions
  };

  return request.post(url, formData, requestOptions);
};

export const assignEmojiToSpace: RequestInterface<
  AssignEmojiToSpaceRequest,
  AssignEmojiToSpaceResponse
> = (options) => {
  const {emojiId, spaceId, ...restOptions} = options;
  const url = emojiRepositoryEndpoints().emojiAddToSpace;

  return request.post(url, {emojiId, spaceId}, restOptions);
};

export const deleteEmoji: RequestInterface<DeleteEmojiRequest, DeleteEmojiResponse> = (options) => {
  const {emojiId, spaceId, ...restOptions} = options;

  const url = emojiRepositoryEndpoints().emojiDelete;

  const requestOptions = {
    ...restOptions,
    data: {
      emojiId,
      worldId: spaceId
    }
  };
  return request.delete(url, requestOptions);
};
