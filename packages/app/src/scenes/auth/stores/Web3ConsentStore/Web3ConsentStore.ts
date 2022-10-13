import {flow, types} from 'mobx-state-tree';
import {RequestModel} from '@momentum-xyz/core';

import {LoginTypeEnum, LoginTypeEnumList} from 'core/enums';
import {
  api,
  GuestConsentRequest,
  Web3ConsentAcceptRequest,
  Web3LoginHintConsentRequest,
  Web3LoginHintConsentResponse
} from 'api';

const Web3ConsentStore = types
  .model('Web3ConsentStore', {
    loginHintRequest: types.optional(RequestModel, {}),
    consentRequest: types.optional(RequestModel, {}),
    loginType: types.maybeNull(types.enumeration(LoginTypeEnumList)),
    redirectUrl: types.maybeNull(types.string)
  })
  .actions((self) => ({
    fetchLoginType: flow(function* (consent_challenge: string) {
      const data: Web3LoginHintConsentRequest = {consent_challenge};
      const response: Web3LoginHintConsentResponse = yield self.loginHintRequest.send(
        api.webRepository.getLoginHintByConsent,
        data
      );

      if (response) {
        self.loginType = response.loginHint as LoginTypeEnum;
      }
    }),
    web3consentAccept: flow(function* (consent_challenge: string) {
      const data: Web3ConsentAcceptRequest = {consent_challenge};
      const response = yield self.consentRequest.send(api.webRepository.consentAccept, data);

      if (response) {
        self.redirectUrl = response.redirect;
      }
    }),
    guestConsentAccept: flow(function* (challenge: string) {
      const data: GuestConsentRequest = {challenge};
      const response = yield self.consentRequest.send(api.guestRepository.loginConsent, data);

      if (response) {
        self.redirectUrl = response.redirect;
      }
    })
  }));

export {Web3ConsentStore};
