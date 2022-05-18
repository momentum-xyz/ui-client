import {isWeb3Injected, web3Accounts, web3Enable} from '@polkadot/extension-dapp';
import {ApiPromise, WsProvider} from '@polkadot/api';
import {decodeAddress, encodeAddress} from '@polkadot/util-crypto';
import {
  BN,
  BN_ZERO,
  BN_ONE,
  hexToU8a,
  isHex,
  bnMin,
  BN_MAX_INTEGER,
  extractTime
} from '@polkadot/util';
import {DeriveSessionProgress, DeriveStakingAccount} from '@polkadot/api-derive/types';
import {t} from 'i18next';

import {endpoints} from 'api/constants';

type Unlocking = {
  remainingEras: BN;
  value: BN;
};

export type UnlockingDurationReturnType = {
  days: string | null;
  hours: string | null;
  minutes: string | null;
  seconds?: string | null;
};
export type DeriveUnbondingProgressReturnType = [[Unlocking, BN, BN][]] | [never[], BN];

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
    stakingInfo: DeriveStakingAccount | null,
    progress: DeriveSessionProgress | null
  ): DeriveUnbondingProgressReturnType {
    if (!stakingInfo?.unlocking || !progress) {
      return [[], BN_ZERO];
    } else {
      const mapped = stakingInfo.unlocking
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
      return [mapped];
    }
  }

  static formatUnlockingDuration(blockTime: BN, blocks: BN): UnlockingDurationReturnType | null {
    const result = bnMin(BN_MAX_INTEGER, blockTime.mul(blocks)).toNumber();
    const {days, hours, minutes, seconds} = extractTime(Math.abs(result));

    return result < 0
      ? null
      : {
          days: days ? (days > 1 ? t('days', {days}) : t('days', {days: 1})) : null,
          hours: hours ? (hours > 1 ? t('hours', {hours}) : t('hours', {hours: 1})) : null,
          minutes: minutes
            ? minutes > 1
              ? t('minutes', {minutes})
              : t('minutes', {minutes: 1})
            : null,
          seconds: seconds
            ? seconds > 1
              ? t('seconds', {seconds})
              : t('seconds', {seconds: 1})
            : null
        };
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
