import {generatePath} from 'react-router-dom';

import {RequestInterface} from 'api/interfaces';
import {request} from 'api/request';

import {emojiRepositoryEndpoints} from './emojiRepository.api.endpoints';
import {
  DeleteEmojiRequest,
  DeleteEmojiResponse,
  UploadEmojiRequest,
  UploadEmojiResponse
} from './emojiRepository.api.types';

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
