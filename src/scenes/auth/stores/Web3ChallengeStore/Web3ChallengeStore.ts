import {flow, types} from 'mobx-state-tree';
import {UserRejectedRequestError} from '@web3-react/walletconnect-connector';
import {UnsupportedChainIdError} from '@web3-react/core';
import {UserRejectedRequestError as UserRejectedRequestErrorWalletConnect} from '@web3-react/walletconnect-connector';
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected
} from '@web3-react/injected-connector';
import {t} from 'i18next';

import {RequestModel} from 'core/models';
import {PolkadotExtensionException, SessionException} from 'core/exceptions';
import {api, Web3ChallengeRequest, Web3LoginAcceptRequest} from 'api';

const Web3ChallengeStore = types
  .model('Web3ChallengeStore', {
    challengeRequest: types.optional(RequestModel, {}),
    loginRequest: types.optional(RequestModel, {})
  })
  .actions((self) => ({
    getChallengeForSign: flow(function* (login_challenge: string, address: string) {
      const data: Web3ChallengeRequest = {login_challenge, address};
      return yield self.challengeRequest.send(api.webRepository.getChallengeForSign, data);
    }),
    loginAccept: flow(function* (address: string, login: string, wallet?: string) {
      const data: Web3LoginAcceptRequest = {
        signed_address_challenge: address,
        login_challenge: login,
        wallet_type: wallet
      };
      return yield self.loginRequest.send(api.webRepository.loginAccept, data);
    }),
    getErrorMessage(error: Error): string {
      if (error instanceof NoEthereumProviderError) {
        return t('errors.ethereumExtension');
      } else if (error instanceof UnsupportedChainIdError) {
        return t('errors.unsupportedNetwork');
      } else if (
        error instanceof UserRejectedRequestErrorInjected ||
        error instanceof UserRejectedRequestErrorWalletConnect ||
        error instanceof UserRejectedRequestError
      ) {
        return t('errors.ethereumAccess');
      } else if (error instanceof SessionException) {
        return t('errors.oidcSession');
      } else if (error instanceof PolkadotExtensionException) {
        return error.message;
      } else {
        console.error(error);
        return t('errors.unknownError');
      }
    }
  }));

export {Web3ChallengeStore};
