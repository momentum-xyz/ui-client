import {cast, flow, types} from 'mobx-state-tree';
import {LAST_AIRDROP_KEY, Map3dUserInterface, RequestModel} from '@momentum-xyz/core';

import {storage} from 'shared/services';
import {StorageKeyEnum} from 'core/enums';
import {ROUTES} from 'core/constants';
import {PolkadotAddressInterface, User} from 'core/models';
import {getAccessToken, refreshAxiosToken} from 'api/request';
import {api, AuthChallengeRequest, CheckProfileUpdatingJobResponse, FetchMeResponse} from 'api';
import PolkadotImplementation from 'shared/services/web3/polkadot.class';

const SessionStore = types
  .model('SessionStore', {
    token: '',
    isAuthenticating: true,
    user: types.maybeNull(User),
    profileJobId: types.maybeNull(types.string),
    guestTokenRequest: types.optional(RequestModel, {}),
    challengeRequest: types.optional(RequestModel, {}),
    tokenRequest: types.optional(RequestModel, {}),
    profileRequest: types.optional(RequestModel, {}),
    profileJobRequest: types.optional(RequestModel, {})
  })
  .actions((self) => ({
    updateAxiosAndUnityTokens(token: string): void {
      self.token = token;
      // TODO: Uncomment. Check Unity is ready.
      // const {unityStore} = getRootStore(self).mainStore;
      // unityStore.setAuthToken(self.token); // TODO: change key
      refreshAxiosToken(self.token);
    }
  }))
  // FIXME: Profile changes should come from a new PosBus
  .actions((self) => ({
    initJobId(): void {
      const jobId = storage.get<string>(StorageKeyEnum.ProfileJobId);
      self.profileJobId = jobId || null;
    },
    setupJobId(jobId: string) {
      storage.setString(StorageKeyEnum.ProfileJobId, jobId);
      self.profileJobId = jobId;
    },
    clearJobId() {
      storage.delete(StorageKeyEnum.ProfileJobId);
      self.profileJobId = null;
    }
  }))
  .actions((self) => ({
    fetchGuestToken: flow(function* () {
      const response = yield self.guestTokenRequest.send(api.authRepository.getGuestToken, {});
      self.updateAxiosAndUnityTokens(response?.token || '');

      return !!response?.token;
    }),
    fetchTokenByWallet: flow(function* (account: PolkadotAddressInterface) {
      const publicKey = PolkadotImplementation.getPublicKeyFromAddress(account.address);
      const hexPublicKey = PolkadotImplementation.convertU8AToHex(publicKey);

      const data: AuthChallengeRequest = {wallet: hexPublicKey};
      const response = yield self.challengeRequest.send(api.authRepository.getChallenge, data);

      if (!!response?.challenge && !!account) {
        PolkadotImplementation.getAddresses();
        const result = yield PolkadotImplementation.signRaw(
          account.meta?.source || '',
          PolkadotImplementation.convertStringToHex(response.challenge),
          account.address
        );
        if (result?.signature) {
          const data = {wallet: hexPublicKey, signedChallenge: result.signature};
          const response = yield self.tokenRequest.send(api.authRepository.getToken, data);
          self.updateAxiosAndUnityTokens(response?.token || '');

          return !!response?.token;
        }
      }

      return false;
    }),
    fetchProfileJobStatus: flow(function* () {
      if (self.profileJobId) {
        const response: CheckProfileUpdatingJobResponse = yield self.profileJobRequest.send(
          api.userProfileRepository.checkJobById,
          {job_id: self.profileJobId}
        );

        return response?.status;
      }

      return;
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
    }),
    signOutRedirect(): void {
      self.clearJobId();
      self.updateAxiosAndUnityTokens('');

      // FIXME: To use the storage instance and the StorageKeyEnum
      localStorage.removeItem(LAST_AIRDROP_KEY);
      document.location = ROUTES.signIn;
    },
    signInRedirect(isNewAccount?: boolean): void {
      document.location = isNewAccount ? ROUTES.signInAccount : ROUTES.signIn;
    }
  }))
  .actions((self) => ({
    init: flow(function* () {
      const token = getAccessToken();
      if (token) {
        self.updateAxiosAndUnityTokens(token);
      } else {
        yield self.fetchGuestToken();
      }

      yield self.loadUserProfile();

      self.initJobId();
      self.isAuthenticating = false;
    })
  }))
  .views((self) => ({
    get hasToken(): boolean {
      return !!self.token;
    },
    get isAuthenticated(): boolean {
      return !!self.token || !self.isAuthenticating;
    },
    get isTokenPending(): boolean {
      return self.challengeRequest.isPending || self.tokenRequest.isPending;
    },
    get isUpdatingInBlockchain(): boolean {
      return !!self.profileJobId;
    },
    get isGuestTokenPending(): boolean {
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
    },
    get map3dUser(): Map3dUserInterface | null {
      return self.user
        ? {
            uuid: self.user.id,
            name: self.user.name,
            owner: self.user.wallet,
            image: self.user.profile.avatarHash
          }
        : null;
    }
  }));

export {SessionStore};
