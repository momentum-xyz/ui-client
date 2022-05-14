import {RequestInterface} from 'api/interfaces';
import {request} from 'api/request';

import {magicRepositoryEndpoints} from './magicRepository.api.endpoints';
import {
  MagicLinkGenerateRequest,
  MagicLinkGetRequest,
  MagicLinkResponse
} from './magicRepository.api.types';

export const generateLink: RequestInterface<MagicLinkGenerateRequest, MagicLinkResponse> = (
  options
) => {
  const {id, key, data, type, ...restOptions} = options;

  const URL = magicRepositoryEndpoints.generateLink;
  return request.post(URL, {id, key, data, type}, restOptions);
};

export const getMagicLink: RequestInterface<MagicLinkGetRequest, MagicLinkResponse> = (options) => {
  const {key, ...restOptions} = options;

  const URL = `${magicRepositoryEndpoints.base}/${key}`;
  return request.get(URL, restOptions);
};
