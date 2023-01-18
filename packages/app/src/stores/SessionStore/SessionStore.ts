import {cast, flow, types} from 'mobx-state-tree';
import {decodeAddress} from '@polkadot/util-crypto';
import {stringToHex, u8aToHex} from '@polkadot/util';
import {web3FromSource} from '@polkadot/extension-dapp';
import {RequestModel} from '@momentum-xyz/core';

import {GuestLoginFormInterface} from 'core/interfaces';
import {PolkadotAddressInterface, User} from 'core/models';
import {getAccessToken, refreshAxiosToken} from 'api/request';
import {api, AuthChallengeRequest, AuthGuestTokenRequest, FetchMeResponse} from 'api';

const SessionStore = types
  .model('SessionStore', {
    token: '',
    isAuthenticating: true,
    user: types.maybeNull(User),
    guestTokenRequest: types.optional(RequestModel, {}),
    challengeRequest: types.optional(RequestModel, {}),
    tokenRequest: types.optional(RequestModel, {}),
    profileRequest: types.optional(RequestModel, {}),
    statusRequest: types.optional(RequestModel, {})
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
      refreshAxiosToken(self.token);
    }
  }))
  .actions((self) => ({
    init(): void {
      self.token = getAccessToken();
      self.updateAxiosAndUnityTokens();
      self.isAuthenticating = false;
    },
    fetchGuestToken: flow(function* (form: GuestLoginFormInterface) {
      const data: AuthGuestTokenRequest = {...form};
      const response = yield self.guestTokenRequest.send(api.authRepository.getGuestToken, data);
      self.token = response?.token || '';
      self.updateAxiosAndUnityTokens();

      return !!response?.token;
    }),
    fetchTokenByWallet: flow(function* (account: PolkadotAddressInterface) {
      const publicKey = decodeAddress(account.address);
      const hexPublicKey = u8aToHex(publicKey);

      const data: AuthChallengeRequest = {wallet: hexPublicKey};
      const response = yield self.challengeRequest.send(api.authRepository.getChallenge, data);

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
    }),
    loadUserProfile: flow(function* () {
      const response: FetchMeResponse = yield self.profileRequest.send(
        api.userRepository.fetchMe,
        {}
      );
      if (response) {
        self.user = cast(response);
      }

      return !!response?.id;
    })
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
    },
    get isUserReady(): boolean {
      return !!self.user;
    },
    get isGuest(): boolean {
      return self.user?.isGuest ?? true;
    },
    get userId(): string {
      return self.user?.id || '';
    },
    get wallet(): string {
      return self.user?.wallet || '';
    }
  }));

export {SessionStore};
