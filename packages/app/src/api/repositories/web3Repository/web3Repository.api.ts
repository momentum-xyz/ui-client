import {Method} from 'axios';

import {request} from 'api/request';
import {RequestInterface} from 'api/interfaces';

import {
  Web3LoginHintRequest,
  Web3LoginHintResponse,
  Web3ConsentAcceptRequest,
  Web3ConsentAcceptResponse,
  Web3ChallengeRequest,
  Web3ChallengeResponse,
  Web3LoginAcceptRequest,
  Web3LoginAcceptResponse,
  Web3LoginHintConsentRequest,
  Web3LoginHintConsentResponse
} from './web3Repository.api.types';
import {web3RepositoryEndpoints} from './web3Repository.api.endpoints';

export const getLoginHintByLogin: RequestInterface<Web3LoginHintRequest, Web3LoginHintResponse> = (
  options
) => {
  const {login_challenge, ...rest} = options;
  const requestParams = {
    params: {login_challenge},
    ...rest
  };
  const URL: string = web3RepositoryEndpoints().login;
  return request.get(URL, requestParams);
};

export const getLoginHintByConsent: RequestInterface<
  Web3LoginHintConsentRequest,
  Web3LoginHintConsentResponse
> = (options) => {
  const {consent_challenge, ...rest} = options;
  const requestParams = {
    params: {consent_challenge},
    ...rest
  };
  const URL: string = web3RepositoryEndpoints().consent;
  return request.get(URL, requestParams);
};

export const getChallengeForSign: RequestInterface<Web3ChallengeRequest, Web3ChallengeResponse> = (
  options
) => {
  const {login_challenge, address, ...rest} = options;
  const requestParams = {
    params: {login_challenge, address},
    ...rest
  };
  const URL: string = web3RepositoryEndpoints().challenge;
  return request.get(URL, requestParams);
};

export const loginAccept: RequestInterface<Web3LoginAcceptRequest, Web3LoginAcceptResponse> = (
  options
) => {
  const {signed_address_challenge, login_challenge, wallet_type, ...rest} = options;
  const requestParams = {
    method: 'post' as Method,
    data: {signed_address_challenge, login_challenge, wallet_type},
    ...rest
  };

  const URL: string = web3RepositoryEndpoints().login;
  return request(URL, requestParams);
};

export const consentAccept: RequestInterface<
  Web3ConsentAcceptRequest,
  Web3ConsentAcceptResponse
> = (options) => {
  const {consent_challenge, ...rest} = options;
  const requestParams = {
    method: 'post' as Method,
    data: {consent_challenge},
    ...rest
  };

  const URL: string = web3RepositoryEndpoints().consent;
  return request(URL, requestParams);
};
