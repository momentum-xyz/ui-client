import {Method} from 'axios';

import {request} from 'api/request';
import {RequestInterface} from 'api/interfaces';

import {authRepositoryEndpoints} from './authRepository.api.endpoints';
import {
  AttachAccountRequest,
  AttachAccountResponse,
  AuthChallengeRequest,
  AuthChallengeResponse,
  AuthGuestTokenRequest,
  AuthGuestTokenResponse,
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

export const attachAccount: RequestInterface<AttachAccountRequest, AttachAccountResponse> = (
  options
) => {
  const {signedChallenge, wallet, network, ...rest} = options;
  const requestParams = {
    method: 'post' as Method,
    data: {signedChallenge, wallet, network},
    ...rest
  };

  const URL: string = authRepositoryEndpoints().attachAccount;
  return request(URL, requestParams);
};

export const getToken: RequestInterface<AuthTokenRequest, AuthTokenResponse> = (options) => {
  const {signedChallenge, wallet, network, ...rest} = options;
  const requestParams = {
    method: 'post' as Method,
    data: {signedChallenge, wallet, network},
    ...rest
  };

  const URL: string = authRepositoryEndpoints().token;
  return request(URL, requestParams);
};

export const getGuestToken: RequestInterface<AuthGuestTokenRequest, AuthGuestTokenResponse> = (
  options
) => {
  const URL: string = authRepositoryEndpoints().guestToken;
  return request.post(URL, {}, options);
};
