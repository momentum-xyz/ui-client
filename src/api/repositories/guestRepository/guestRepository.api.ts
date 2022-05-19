import {Method} from 'axios';

import {request} from 'api/request';
import {RequestInterface} from 'api/interfaces';

import {
  GuestLoginRequest,
  GuestLoginResponse,
  GuestConsentRequest,
  GuestConsentResponse
} from './guestRepository.api.types';
import {guestRepositoryEndpoints} from './guestRepository.api.endpoints';

export const loginGuest: RequestInterface<GuestLoginRequest, GuestLoginResponse> = (options) => {
  const {challenge, ...rest} = options;
  const requestParams = {
    method: 'post' as Method,
    data: {challenge},
    ...rest
  };

  const URL: string = guestRepositoryEndpoints.login;
  return request(URL, requestParams);
};

export const loginConsent: RequestInterface<GuestConsentRequest, GuestConsentResponse> = (
  options
) => {
  const {challenge, ...rest} = options;
  const requestParams = {
    method: 'post' as Method,
    data: {challenge},
    ...rest
  };

  const URL: string = guestRepositoryEndpoints.consent;
  return request(URL, requestParams);
};
