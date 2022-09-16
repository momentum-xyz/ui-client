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
  EmojiConfigLegacyResponse,
  EmojiConfigRequest,
  EmojiConfigResponse,
  UploadEmojiRequest,
  UploadEmojiResponse
} from './emojiRepository.api.types';

export const fetchSpaceEmojiConfig: RequestInterface<
  EmojiConfigRequest,
  EmojiConfigResponse
> = async (options) => {
  const {worldId, ...restOptions} = options;

  const url = generatePath(emojiRepositoryEndpoints().spaceEmojiConfig, {worldId});

  const resp = await request.get(url, {...restOptions, params: {children: true}});
  console.log('EMOJI', JSON.stringify(resp.data, null, 2));

  // temp support for legacy format
  // FIXME remove after October 2022
  const testSample = (resp.data as EmojiConfigLegacyResponse)[0];
  if (typeof testSample?.emoji === 'object') {
    resp.data = (resp.data as EmojiConfigLegacyResponse).map(
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

export const uploadEmojiConfig: RequestInterface<UploadEmojiRequest, UploadEmojiResponse> = (
  options
) => {
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
