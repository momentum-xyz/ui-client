import {cast, flow, types} from 'mobx-state-tree';
import {AuthContextProps} from 'react-oidc-context';
import {OidcClientSettings} from 'oidc-client-ts';
import {ExternalProvider, Web3Provider} from '@ethersproject/providers';
import {RequestModel, UserStatusEnum} from '@momentum-xyz/core';

import {storage} from 'shared/services';
import {api, FetchUserResponse} from 'api';
import {UserProfileModel} from 'core/models';
import {LoginTypeEnum, StorageKeyEnum} from 'core/enums';
import {guestProviderConfig, keycloakProviderConfig, web3ProviderConfig} from 'shared/auth';

const SessionStore = types
  .model('SessionStore', {
    request: types.optional(RequestModel, {}),
    profileRequest: types.optional(RequestModel, {}),
    profile: types.maybeNull(UserProfileModel),
    statusChangeRequest: types.optional(RequestModel, {}),
    idToken: types.maybe(types.string),
    userId: ''
  })
  .actions((self) => ({
    async init(idToken: string) {
      self.idToken = idToken;
      await this.checkUserProfile();
      await this.loadUserProfile();
    },
    async reload() {
      await this.loadUserProfile();
    },
    checkUserProfile: flow(function* () {
      yield self.request.send(api.userRepository.check, {idToken: self.idToken});
    }),
    loadUserProfile: flow(function* () {
      const response: FetchUserResponse = yield self.profileRequest.send(
        api.userRepository.fetchMe,
        {}
      );
      if (response) {
        self.profile = cast(response);
        self.userId = response.id;
      }
    }),
    getLibrary(provider: ExternalProvider): Web3Provider {
      const library = new Web3Provider(provider);
      library.pollingInterval = 10000;
      return library;
    },
    logout: flow(function* (auth: AuthContextProps) {
      yield auth.revokeTokens();
      yield auth.removeUser();
    })
  }))
  .actions((self) => ({
    changeStatus: flow(function* (status: UserStatusEnum) {
      yield self.statusChangeRequest.send(api.statusRepository.changeStatus, {status});

      if (self.profile && self.statusChangeRequest.isDone) {
        self.profile.status = status;
      }
    }),
    updateName(name: string) {
      if (self.profile) {
        self.profile.name = name;
      }
    }
  }))
  .views((self) => ({
    get isUserReady(): boolean {
      return !self.request.isPending && !self.profileRequest.isPending && !!self.profile;
    },
    get loginType(): LoginTypeEnum | null {
      const loginType = storage.get<LoginTypeEnum>(StorageKeyEnum.LoginType);
      return loginType ? (loginType as LoginTypeEnum) : null;
    },
    get isGuest(): boolean {
      return this.loginType === LoginTypeEnum.Guest;
    },
    get isSessionExists(): boolean {
      return !!storage.getByPrefix('oidc.user');
    },
    get oidcConfig(): OidcClientSettings | null {
      switch (this.loginType) {
        case LoginTypeEnum.Keycloak:
          return keycloakProviderConfig();
        case LoginTypeEnum.Guest:
          return guestProviderConfig();
        case LoginTypeEnum.Polkadot:
        case LoginTypeEnum.Metamask:
        case LoginTypeEnum.WalletConnect:
          return web3ProviderConfig();
        default:
          return null;
      }
    }
  }));

export {SessionStore};
