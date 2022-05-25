import {RequestInterface} from 'api/interfaces';
import {request} from 'api/request';

import {tokenRepositoryEndpoints} from './tokenRepository.api.endpoints';
import {
  BaseTokensRequest,
  FetchTokensResponse,
  TokenNameRequest,
  FetchTokenNameResponse,
  CreateTokenRequest,
  CreateTokenResponse,
  TokenSearchResponse,
  TokenSearchRequest
} from './tokenRepository.api.types';

export const fetchTokens: RequestInterface<BaseTokensRequest, FetchTokensResponse> = (options) => {
  const {...restOptions} = options;
  const url = tokenRepositoryEndpoints().base;

  return request.get(url, {...restOptions});
};

export const fetchTokenName: RequestInterface<TokenNameRequest, FetchTokenNameResponse> = (
  options
) => {
  const {address, network} = options;
  const url = tokenRepositoryEndpoints().info;
  options.params = {network, address};
  return request.get(url, options);
};

export const createToken: RequestInterface<CreateTokenRequest, CreateTokenResponse> = (options) => {
  const {data, ...restOptions} = options;

  const url = tokenRepositoryEndpoints().create;

  return request.post(url, data, restOptions);
};

export const searchToken: RequestInterface<TokenSearchRequest, TokenSearchResponse> = (options) => {
  const {q} = options;

  options.params = {q};

  return request.get(tokenRepositoryEndpoints().search, options);
};
