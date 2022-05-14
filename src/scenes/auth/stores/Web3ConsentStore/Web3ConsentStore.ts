import {flow, types} from 'mobx-state-tree';

import {RequestModel} from 'core/models';
import {api, Web3ConsentAcceptRequest} from 'api';

const Web3ConsentStore = types
  .model('Web3Store', {
    consentRequest: types.optional(RequestModel, {}),
    redirectUrl: types.maybeNull(types.string)
  })
  .actions((self) => ({
    consentAccept: flow(function* (consent_challenge: string) {
      const data: Web3ConsentAcceptRequest = {consent_challenge};
      const response = yield self.consentRequest.send(api.webRepository.consentAccept, data);
      if (response) {
        self.redirectUrl = response.redirect;
      }
    })
  }));

export {Web3ConsentStore};
