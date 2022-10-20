import {cast, flow, types} from 'mobx-state-tree';
import {AuthContextProps} from 'react-oidc-context';
import {OidcClientSettings} from 'oidc-client-ts';
import {ExternalProvider, Web3Provider} from '@ethersproject/providers';
import {RequestModel} from '@momentum-xyz/core';

import {storage} from 'shared/services';
import {api, FetchUserResponse} from 'api';
import {User} from 'core/models';
import {LoginTypeEnum, StorageKeyEnum} from 'core/enums';
import {guestProviderConfig, keycloakProviderConfig, web3ProviderConfig} from 'shared/auth';

const SessionStore = types
  .model('SessionStore', {
    user: types.maybeNull(User),
    request: types.optional(RequestModel, {}),
    profileRequest: types.optional(RequestModel, {})
  })
  .actions((self) => ({
    async init(idToken: string) {
      await this.checkUserProfile(idToken);
      await this.loadUserProfile();
    },
    checkUserProfile: flow(function* (idToken: string) {
      yield self.request.send(api.userRepository.check, {idToken});
    }),
    loadUserProfile: flow(function* () {
      const response: FetchUserResponse = yield self.profileRequest.send(
        api.userRepository.fetchMe,
        {}
      );
      if (response) {
        self.user = cast(response);
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
  .views((self) => ({
    get userId(): string {
      return self.user?.id || '';
    },
    get isUserReady(): boolean {
      return !self.request.isPending && !self.profileRequest.isPending && !!self.user;
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
