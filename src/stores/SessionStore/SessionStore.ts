import {cast, flow, types} from 'mobx-state-tree';
import {AuthContextProps} from 'react-oidc-context';
import {OidcClientSettings, SignoutRedirectArgs} from 'oidc-client-ts';
import {ExternalProvider, Web3Provider} from '@ethersproject/providers';

import {storage} from 'core/services';
import {api, FetchUserResponse} from 'api';
import {RequestModel, UserProfileModel} from 'core/models';
import {bytesToUuid, deleteCookieByName} from 'core/utils';
import {LoginTypeEnum, StorageKeyEnum} from 'core/enums';
import {keycloakProviderConfig, web3ProviderConfig, guestProviderConfig} from 'shared/auth';

const SessionStore = types
  .model('SessionStore', {
    request: types.optional(RequestModel, {}),
    profileRequest: types.optional(RequestModel, {}),
    profile: types.maybeNull(UserProfileModel),
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
      await this.checkUserProfile();
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
        self.userId = bytesToUuid(response.id?.data);
      }
    }),
    getLibrary(provider: ExternalProvider): Web3Provider {
      const library = new Web3Provider(provider);
      library.pollingInterval = 10000;
      return library;
    },
    logout: flow(function* (auth: AuthContextProps) {
      const id_token_hint = auth.user?.id_token;
      yield auth.revokeTokens();
      yield auth.removeUser();
      yield auth.signoutRedirect({id_token_hint: id_token_hint} as SignoutRedirectArgs);
      deleteCookieByName('CREATE_INITIATIVE_SHOWN');
    })
  }))
  .views((self) => ({
    get isUserReady(): boolean {
      return !self.request.isPending && !self.profileRequest.isPending && !!self.profile;
    },
    get oidcConfig(): OidcClientSettings | null {
      const loginType = storage.get<LoginTypeEnum>(StorageKeyEnum.LoginType);

      switch (loginType) {
        case LoginTypeEnum.Keycloak:
          return keycloakProviderConfig;
        case LoginTypeEnum.Guest:
          return guestProviderConfig;
        case LoginTypeEnum.Polkadot:
        case LoginTypeEnum.Metamask:
        case LoginTypeEnum.WalletConnect:
          return web3ProviderConfig;
        default:
          return null;
      }
    }
  }));

export {SessionStore};
