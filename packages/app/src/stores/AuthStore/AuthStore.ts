import {flow, types} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum-xyz/core';
import {web3FromSource} from '@polkadot/extension-dapp';
import {stringToHex, u8aToHex} from '@polkadot/util';
import {decodeAddress} from '@polkadot/util-crypto';

import {getRootStore} from 'core/utils';
import {PolkadotAddressInterface} from 'core/models';
import {GuestLoginFormInterface} from 'core/interfaces';
import {getAccessToken, refreshAxiosToken} from 'api/request';
import {api, AuthChallengeRequest, AuthGuestTokenRequest} from 'api';

const WALLET_KEY = 'odyssey.wallet';
const storeWallet = (wallet: string): void => {
  localStorage.setItem(WALLET_KEY, wallet);
};

const getStoredWallet = (): string => {
  return localStorage.getItem(WALLET_KEY) || '';
};

const AuthStore = types.compose(
  ResetModel,
  types
    .model('AuthStore', {
      isAuthenticating: true,
      token: '',
      wallet: '',
      guestTokenRequest: types.optional(RequestModel, {}),
      challengeRequest: types.optional(RequestModel, {}),
      tokenRequest: types.optional(RequestModel, {})
    })
    .actions((self) => ({
      updateAxiosAndUnityTokens(): void {
        // TODO: Uncomment. Check Unity is ready.
        // const {unityStore} = getRootStore(self).mainStore;
        // unityStore.setAuthToken(self.token); // TODO: change key
        refreshAxiosToken(self.token);
      },
      clear(): void {
        self.token = '';
        self.wallet = '';
        refreshAxiosToken(self.token);
      }
    }))
    .actions((self) => ({
      init(): void {
        self.token = getAccessToken();
        self.updateAxiosAndUnityTokens();
        self.isAuthenticating = false;
      },
      selectWallet(wallet: string): void {
        self.wallet = wallet;

        storeWallet(wallet);

        // FIXME: here?
        getRootStore(self).nftStore.subscribeToBalanseChanges(wallet);
      },
      fetchGuestToken: flow(function* (form: GuestLoginFormInterface) {
        const data: AuthGuestTokenRequest = {...form};
        const response = yield self.guestTokenRequest.send(api.authRepository.getGuestToken, data);
        self.token = response?.token || '';
        self.updateAxiosAndUnityTokens();

        return !!response?.token;
      }),
      fetchTokenByWallet: flow(function* (account: PolkadotAddressInterface) {
        const publicKey = decodeAddress(self.wallet);
        const hexPublicKey = u8aToHex(publicKey);

        const data: AuthChallengeRequest = {wallet: hexPublicKey};
        const response = yield self.challengeRequest.send(api.authRepository.getChallenge, data);

        //const account = self.accounts.find((i) => i.address === self.wallet);

        if (!!response?.challenge && !!account) {
          const injector = yield web3FromSource(account.meta?.source || '');
          const signRaw = injector?.signer?.signRaw;

          if (signRaw) {
            const result = yield signRaw({
              data: stringToHex(response.challenge),
              address: account.address,
              type: 'bytes'
            }).catch((error: unknown) => {
              // TODO: Show some error
              console.log(error);
            });

            if (result?.signature) {
              const data = {wallet: hexPublicKey, signedChallenge: result.signature};
              const response = yield self.tokenRequest.send(api.authRepository.getToken, data);
              self.token = response?.token || '';
              self.updateAxiosAndUnityTokens();

              return !!response?.token;
            }
          }
        }

        return false;
      })
    }))
    .actions((self) => ({
      tryToRestoreWallet() {
        const storedWallet = getStoredWallet();
        if (storedWallet) {
          console.log('Restore wallet', storedWallet);
          self.selectWallet(storedWallet);
        }
      }
    }))
    .views((self) => ({
      get hasToken(): boolean {
        return !!self.token;
      },
      get isAuthenticated(): boolean {
        return !!self.token || !self.isAuthenticating;
      },
      get isPending(): boolean {
        return self.challengeRequest.isPending || self.tokenRequest.isPending;
      },
      get isGuestPending(): boolean {
        return self.guestTokenRequest.isPending;
      }
    }))
);

export {AuthStore};
