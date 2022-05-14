import {isWeb3Injected, web3Accounts, web3Enable} from '@polkadot/extension-dapp';
import {ApiPromise, WsProvider} from '@polkadot/api';
import {decodeAddress, encodeAddress} from '@polkadot/util-crypto';
import {BN, BN_ZERO, BN_ONE, hexToU8a, isHex} from '@polkadot/util';
import {DeriveSessionProgress, DeriveStakingAccount} from '@polkadot/api-derive/types';

import {endpoints} from 'api/constants';

interface Unlocking {
  remainingEras: BN;
  value: BN;
}

type DeriveUnbondingProgressReturnType = [Unlocking, BN, BN][] | [[], BN];

export default class SubstrateProvider {
  static FORMAT_OPTIONS = {withSi: false, forceUnit: '-'};

  static async initAPI() {
    const provider = new WsProvider(endpoints.westendTestWebsocketServer);
    return ApiPromise.create({provider});
  }

  static async isExtensionEnabled() {
    const connection = await web3Enable(endpoints.polkadotConnectionString);
    return connection.length !== 0 || isWeb3Injected;
  }

  static async getAddresses(ss58Format = 42) {
    return web3Accounts({ss58Format}).then((accounts) => accounts);
  }

  static deriveUnbondingProgress(
    stakingInfo: DeriveStakingAccount,
    progress: DeriveSessionProgress
  ): DeriveUnbondingProgressReturnType {
    if (!stakingInfo?.unlocking || !progress) {
      return [[], BN_ZERO];
    } else {
      return stakingInfo.unlocking
        .filter(({remainingEras, value}) => value.gt(BN_ZERO) && remainingEras.gt(BN_ZERO))
        .map((unlock): [Unlocking, BN, BN] => [
          unlock,
          unlock.remainingEras,
          unlock.remainingEras
            .sub(BN_ONE)
            .imul(progress.eraLength)
            .iadd(progress.eraLength)
            .isub(progress.eraProgress)
        ]);
    }
  }

  static isValidSubstrateAddress(address: string) {
    try {
      encodeAddress(isHex(address) ? hexToU8a(address) : decodeAddress(address));
      return true;
    } catch (error) {
      return false;
    }
  }
}
