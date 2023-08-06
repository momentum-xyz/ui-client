import {cast, flow, types} from 'mobx-state-tree';
import {RequestModel} from '@momentum-xyz/core';

import {ROUTES} from 'core/constants';
import {getImageAbsoluteUrl} from 'core/utils';
import {getAccessToken, refreshAxiosToken} from 'api/request';
import {PolkadotAddressInterface, User, WorldInfo} from 'core/models';
import PolkadotImplementation from 'shared/services/web3/polkadot.class';
import {api, AuthChallengeRequest, FetchMeResponse, WorldInfoInterface} from 'api';

const SessionStore = types
  .model('SessionStore', {
    token: '',
    isAuthenticating: true,
    user: types.maybeNull(User),
    worldsOwnedList: types.optional(types.array(WorldInfo), []),
    worldsStakedList: types.optional(types.array(WorldInfo), []),

    guestTokenRequest: types.optional(RequestModel, {}),
    challengeRequest: types.optional(RequestModel, {}),
    tokenRequest: types.optional(RequestModel, {}),
    attachAccountRequest: types.optional(RequestModel, {}),
    profileRequest: types.optional(RequestModel, {}),
    worldsRequest: types.optional(RequestModel, {})
  })
  .actions((self) => ({
    updateJwtToken(token: string): void {
      self.token = token;
      refreshAxiosToken(self.token);
    }
  }))
  .actions((self) => ({
    fetchGuestToken: flow(function* () {
      const response = yield self.guestTokenRequest.send(api.authRepository.getGuestToken, {});
      self.updateJwtToken(response?.token || '');
      return !!response?.token;
    }),
    fetchTokenByWalletPolkadot: flow(function* (account: PolkadotAddressInterface) {
      const publicKey = PolkadotImplementation.getPublicKeyFromAddress(account.address);
      const hexPublicKey = PolkadotImplementation.convertU8AToHex(publicKey);

      const data: AuthChallengeRequest = {wallet: hexPublicKey};
      const response = yield self.challengeRequest.send(api.authRepository.getChallenge, data);

      if (!!response?.challenge && !!account) {
        const result = yield PolkadotImplementation.signRaw(
          account.meta?.source || '',
          PolkadotImplementation.convertStringToHex(response.challenge),
          account.address
        );
        if (result?.signature) {
          const data = {wallet: hexPublicKey, signedChallenge: result.signature};
          const response = yield self.tokenRequest.send(api.authRepository.getToken, data);
          return response?.token;
        }
      }

      return false;
    }),
    fetchTokenByWallet: flow(function* (
      account: string,
      signChallenge: (challenge: string) => Promise<string>
    ) {
      const data: AuthChallengeRequest = {wallet: account};
      const response = yield self.challengeRequest.send(api.authRepository.getChallenge, data);

      if (response?.challenge) {
        const signature = yield signChallenge(response.challenge);
        if (signature) {
          const data = {
            wallet: account,
            signedChallenge: signature,
            // network: 'ethereum'
            network: account.length > 42 ? 'polkadot' : 'ethereum'
          };
          const response = yield self.tokenRequest.send(api.authRepository.getToken, data);
          if (response?.token) {
            return response.token;
          }
        }
      }
      throw new Error('Error fetching token');
    }),
    attachAnotherAccount: flow(function* (
      account: string,
      signChallenge: (challenge: string) => Promise<string>
    ) {
      if (!self.user) {
        return;
      }

      const data: AuthChallengeRequest = {wallet: account};
      const challengeResponse = yield self.challengeRequest.send(
        api.authRepository.getChallenge,
        data
      );

      if (challengeResponse?.challenge) {
        const signature = yield signChallenge(challengeResponse.challenge);
        if (signature) {
          const data = {
            wallet: account,
            signedChallenge: signature,
            network: account.length > 42 ? 'polkadot' : 'ethereum'
          };
          const attachResponse = yield self.attachAccountRequest.send(
            api.authRepository.attachAccount,
            data
          );

          if (attachResponse?.error || !attachResponse?.wallet) {
            console.log('Error attaching account, resp:', attachResponse);
            throw new Error(attachResponse.error?.message || 'Error attaching account');
          }

          return;
        }
      }
      throw new Error('Error attaching account');
    }),
    loadUserProfile: flow(function* () {
      const response: FetchMeResponse = yield self.profileRequest.send(
        api.userRepository.fetchMe,
        {}
      );

      if (response?.id) {
        self.user = cast(response);
      }
    }),
    loadOwnWorlds: flow(function* () {
      const userWorlds: WorldInfoInterface[] = yield self.worldsRequest.send(
        api.userRepository.fetchOwnedWorldList,
        {userId: self.user?.id || ''}
      );

      if (userWorlds) {
        self.worldsOwnedList = cast(userWorlds);
      }

      return userWorlds;
    }),
    loadStakedWorlds: flow(function* () {
      const userWorlds: WorldInfoInterface[] = yield self.worldsRequest.send(
        api.userRepository.fetchStakedWorldList,
        {userId: self.user?.id || ''}
      );

      if (userWorlds) {
        self.worldsStakedList = cast(userWorlds);
      }
    })
  }))
  .actions((self) => ({
    loadUserData: flow(function* () {
      yield self.loadUserProfile();
      if (self.user && !self.user.isGuest) {
        yield self.loadOwnWorlds();
        yield self.loadStakedWorlds();
      }
      self.isAuthenticating = false;
    })
  }))
  .actions((self) => ({
    init: flow(function* () {
      const token = getAccessToken();
      if (token) {
        self.updateJwtToken(token);
      } else {
        yield self.fetchGuestToken();
      }

      yield self.loadUserData();
    }),
    saveTokenAndRefreshUser(token: string): void {
      console.log('[SessionStore]: SaveTokenAndRefreshUser', token);
      self.updateJwtToken(token);
      self.loadUserData();
    },
    signOutRedirect(): void {
      self.updateJwtToken('');
      document.location = ROUTES.explore;
    }
  }))
  .views((self) => ({
    get hasToken(): boolean {
      return !!self.token;
    },
    get isAuthenticated(): boolean {
      return !!self.token || !self.isAuthenticating;
    },
    get isSignUpInProgress(): boolean {
      return !!self.user && !self.user.isGuest && !self.user.name;
    },
    get isProfileError(): boolean {
      return self.profileRequest.isError;
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
    get userName(): string {
      return self.user?.name || '';
    },
    get userImageUrl(): string {
      return getImageAbsoluteUrl(self.user?.profile.avatarHash) || '';
    },
    get wallet(): string {
      return self.user?.wallet || '';
    }
  }));

export {SessionStore};
