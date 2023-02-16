import {RequestInterface} from 'api/interfaces';
import {request} from 'api/request';

import {tokenRuleRepositoryEndpoints} from './tokenRuleRepository.api.endpoints';
import {
  AppliedTokenRulesRequest,
  ApplyTokenRuleRequest,
  ApplyTokenRuleResponse,
  BaseTokenRulesRequest,
  CreateTokenRuleRequest,
  CreateTokenRuleResponse,
  DeleteTokenRuleRequest,
  DeleteTokenRuleResponse,
  FetchTokenRulesResponse,
  ProcessTokenRuleRequest,
  ProcessTokenRuleResponse,
  TokenRuleSearchRequest,
  TokenRuleSearchResponse,
  TokenRulesOptionRequest,
  TokenRulesOptionResponse
} from './tokenRuleRepository.api.types';

export const fetchTokenRules: RequestInterface<BaseTokenRulesRequest, FetchTokenRulesResponse> = (
  options
) => {
  const {spaceId, query, children, ...restOptions} = options;
  const url = tokenRuleRepositoryEndpoints().all + (spaceId ? `/${spaceId}` : '');

  return request.get(url, {...restOptions, params: {children: children, q: query}});
};

export const deleteTokenRule: RequestInterface<DeleteTokenRuleRequest, DeleteTokenRuleResponse> = (
  options
) => {
  const {tokenRuleId, ...restOptions} = options;
  const url = tokenRuleRepositoryEndpoints().base + `/${tokenRuleId}`;

  return request.delete(url, restOptions);
};

export const createTokenRule: RequestInterface<CreateTokenRuleRequest, CreateTokenRuleResponse> = (
  options
) => {
  const {data, spaceId, ...restOptions} = options;
  const payload = {
    rule: {
      minBalance: data.minBalance
    },
    spaceId: spaceId,
    tokenId: data.tokenId,
    name: data.name
  };
  const url = tokenRuleRepositoryEndpoints().create;

  return request.post(url, payload, restOptions);
};

export const processTokenRule: RequestInterface<ProcessTokenRuleRequest, ProcessTokenRuleResponse> =
  (options) => {
    const {tokenRuleId, status, ...restOptions} = options;

    const URL = `${tokenRuleRepositoryEndpoints().process}/${tokenRuleId}`;

    return request.post(URL, {status}, restOptions);
  };

export const fetchOptions: RequestInterface<TokenRulesOptionRequest, TokenRulesOptionResponse> = (
  options
) => {
  const url = tokenRuleRepositoryEndpoints().allowedOptions;
  return request.get(url, options);
};

export const searchTokenRule: RequestInterface<TokenRuleSearchRequest, TokenRuleSearchResponse> = (
  options
) => {
  const {q, ...restOptions} = options;

  restOptions.params = {q};

  return request.get(tokenRuleRepositoryEndpoints().search, restOptions);
};

export const applyTokenRule: RequestInterface<ApplyTokenRuleRequest, ApplyTokenRuleResponse> = (
  options
) => {
  const {data, spaceId, ...restOptions} = options;

  const url = tokenRuleRepositoryEndpoints().apply + `/${spaceId}`;

  return request.post(url, data, restOptions);
};

export const fetchAppliedTokenRules: RequestInterface<
  AppliedTokenRulesRequest,
  FetchTokenRulesResponse
> = (options) => {
  const {spaceId, ...restOptions} = options;
  const url = tokenRuleRepositoryEndpoints().all + `/${spaceId}`;

  return request.get(url, restOptions);
};
