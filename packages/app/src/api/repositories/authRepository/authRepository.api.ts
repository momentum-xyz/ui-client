import {Method} from 'axios';

import {request} from 'api/request';
import {RequestInterface} from 'api/interfaces';

import {authRepositoryEndpoints} from './authRepository.api.endpoints';
import {
  ChallengeRequest,
  ChallengeResponse,
  TokenRequest,
  TokenResponse
} from './authRepository.api.types';

export const getChallenge: RequestInterface<ChallengeRequest, ChallengeResponse> = (options) => {
  const {wallet, ...rest} = options;
  const requestParams = {
    params: {wallet},
    ...rest
  };
  const URL: string = authRepositoryEndpoints().challenge;
  return request.get(URL, requestParams);
};

export const getToken: RequestInterface<TokenRequest, TokenResponse> = (options) => {
  const {challenge, ...rest} = options;
  const requestParams = {
    method: 'post' as Method,
    data: {challenge},
    ...rest
  };

  const URL: string = authRepositoryEndpoints().token;
  return request(URL, requestParams);
};
