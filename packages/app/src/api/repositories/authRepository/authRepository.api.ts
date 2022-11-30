import {Method} from 'axios';

import {request} from 'api/request';
import {RequestInterface} from 'api/interfaces';

import {authRepositoryEndpoints} from './authRepository.api.endpoints';
import {
  AuthChallengeRequest,
  AuthChallengeResponse,
  AuthTokenRequest,
  AuthTokenResponse
} from './authRepository.api.types';

export const getChallenge: RequestInterface<AuthChallengeRequest, AuthChallengeResponse> = (
  options
) => {
  const {wallet, ...rest} = options;
  const requestParams = {
    params: {wallet},
    ...rest
  };
  const URL: string = authRepositoryEndpoints().challenge;
  return request.get(URL, requestParams);
};

export const getToken: RequestInterface<AuthTokenRequest, AuthTokenResponse> = (options) => {
  const {signedChallenge, wallet, ...rest} = options;
  const requestParams = {
    method: 'post' as Method,
    data: {signedChallenge, wallet},
    ...rest
  };

  const URL: string = authRepositoryEndpoints().token;
  return request(URL, requestParams);
};
