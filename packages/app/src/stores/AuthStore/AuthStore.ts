import {cast, flow, types} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum-xyz/core';
import {OptionInterface} from '@momentum-xyz/ui-kit';
import {InjectedAccountWithMeta} from '@polkadot/extension-inject/types';
import {web3FromSource} from '@polkadot/extension-dapp';
import {stringToHex, u8aToHex} from '@polkadot/util';
import {decodeAddress} from '@polkadot/util-crypto';

//import {getRootStore} from 'core/utils';
//import {refreshAxiosToken} from 'api/request';
import {DELAY_DEFAULT, wait} from 'core/utils';
import {GuestLoginFormInterface} from 'core/interfaces';
import {api, AuthChallengeRequest, AuthGuestTokenRequest} from 'api';
import SubstrateProvider from 'shared/services/web3/SubstrateProvider';
import {NftStore} from 'stores/NftStore';

const AuthStore = types.compose(
  ResetModel,
  types
    .model('AuthStore', {
      nftStore: types.optional(NftStore, {}),

      token: '',
      wallet: '',
      // TODO adapt nftStore addresses for this
      accounts: types.optional(types.array(types.frozen<InjectedAccountWithMeta>()), []),
      guestTokenRequest: types.optional(RequestModel, {}),
      challengeRequest: types.optional(RequestModel, {}),
      tokenRequest: types.optional(RequestModel, {})
    })
    .actions((self) => ({
      updateAxiosAndUnityTokens(): void {
        // TODO: Uncomment. Check Unity is ready.
        // const {unityStore} = getRootStore(self).mainStore;
        // unityStore.setAuthToken(self.token); // TODO: change key
        // refreshAxiosToken(self.token);
        console.log(self.token);
      }
    }))
    .actions((self) => ({
      init: flow(function* () {
        if (!self.accounts.length) {
          yield wait(DELAY_DEFAULT);
          if (yield SubstrateProvider.isExtensionEnabled()) {
            yield self.nftStore.init();
            const addressesList = yield SubstrateProvider.getAddresses(self.nftStore.ss58Format);
            self.accounts = cast(addressesList);
          }
        }
      }),
      selectWallet(wallet: string): void {
        self.wallet = wallet;

        // here?
        self.nftStore.subscribeToBalanseChanges(wallet);
      },
      fetchGuestToken: flow(function* (form: GuestLoginFormInterface) {
        const data: AuthGuestTokenRequest = {...form};
        const response = yield self.guestTokenRequest.send(api.authRepository.getGuestToken, data);
        self.token = response?.token || '';
        self.updateAxiosAndUnityTokens();

        return !!response?.token;
      }),
      fetchTokenByWallet: flow(function* () {
        const publicKey = decodeAddress(self.wallet);
        const hexPublicKey = u8aToHex(publicKey);

        const data: AuthChallengeRequest = {wallet: hexPublicKey};
        const response = yield self.challengeRequest.send(api.authRepository.getChallenge, data);

        const account = self.accounts.find((i) => i.address === self.wallet);

        if (!!response?.challenge && !!account) {
          const injector = yield web3FromSource(account.meta.source);
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
    .views((self) => ({
      get isPending(): boolean {
        return self.challengeRequest.isPending || self.tokenRequest.isPending;
      },
      get isGuestPending(): boolean {
        return self.guestTokenRequest.isPending;
      },
      get accountOptions(): OptionInterface[] {
        return self.accounts.map((account) => ({
          label: account.meta.name || account.address,
          value: account.address,
          icon: 'polkadotprofile'
        }));
      }
    }))
);

export {AuthStore};
