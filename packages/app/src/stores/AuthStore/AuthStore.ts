import {cast, flow, types} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum-xyz/core';
import {OptionInterface} from '@momentum-xyz/ui-kit';
import {InjectedAccountWithMeta} from '@polkadot/extension-inject/types';
import {web3FromSource} from '@polkadot/extension-dapp';
import {stringToHex} from '@polkadot/util';

import {DELAY_DEFAULT, wait} from 'core/utils';
import {api, AuthChallengeRequest} from 'api';
import SubstrateProvider from 'shared/services/web3/SubstrateProvider';

const AuthStore = types.compose(
  ResetModel,
  types
    .model('AuthStore', {
      wallet: '',
      accounts: types.optional(types.array(types.frozen<InjectedAccountWithMeta>()), []),
      challengeRequest: types.optional(RequestModel, {}),
      tokenRequest: types.optional(RequestModel, {})
    })
    .actions((self) => ({
      init: flow(function* () {
        if (!self.accounts.length) {
          yield wait(DELAY_DEFAULT);
          if (yield SubstrateProvider.isExtensionEnabled()) {
            const addressesList = yield SubstrateProvider.getAddresses();
            self.accounts = cast(addressesList);
          }
        }
      }),
      selectWallet(wallet: string): void {
        self.wallet = wallet;
      },
      getTokenByWallet: flow(function* () {
        const data: AuthChallengeRequest = {wallet: self.wallet};
        const response = yield self.challengeRequest.send(api.authRepository.getChallenge, data);

        const account = self.accounts.find((i) => i.address === self.wallet);

        if (!!response?.challenge && !!account) {
          const injector = yield web3FromSource(account.meta.source);
          const signRaw = injector?.signer?.signRaw;

          if (signRaw) {
            // FIXME: Should we have this step or not?
            // const publicKey = decodeAddress(account.address);
            // const hexPublicKey = u8aToHex(publicKey);
            // const nonce = (await getChallengeForSign(login_challenge, hexPublicKey)).address_challenge;

            const result = yield signRaw({
              //data: stringToHex(nonce),
              data: stringToHex(response.challenge),
              address: account.address,
              type: 'bytes'
            }).catch((error: unknown) => {
              // TODO: Show some error
              console.log(error);
            });

            if (result?.signature) {
              const data = {wallet: self.wallet, signedChallenge: result.signature};
              const response = yield self.tokenRequest.send(api.authRepository.getToken, data);
              return response?.token;
            }
          }
        }
      })
    }))
    .views((self) => ({
      get isPending(): boolean {
        return self.challengeRequest.isPending || self.tokenRequest.isPending;
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
