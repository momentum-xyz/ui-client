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

export type UnlockingDurationReturnType = string;
export type DeriveUnbondingProgressReturnType = [[Unlocking, BN, BN][], BN];

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
      const total = mapped.reduce((total, [{value}]) => total.iadd(value), new BN(0));
      return [mapped, total];
    }
  }

  static formatUnlockingDuration(blockTime: BN, blocks: BN): UnlockingDurationReturnType {
    const value = bnMin(BN_MAX_INTEGER, blockTime.mul(blocks)).toNumber();
    const time = extractTime(Math.abs(value));
    const {days, hours, minutes, seconds} = time;

    return `${value < 0 ? '+' : ''}${[
      days ? (days > 1 ? t('{{days}} days', {replace: {days}}) : t('1day')) : null,
      hours ? (hours > 1 ? t('{{hours}} hrs', {replace: {hours}}) : t('1hr')) : null,
      minutes ? (minutes > 1 ? t('{{minutes}} mins', {replace: {minutes}}) : t('1 min')) : null,
      seconds
        ? seconds > 1
          ? t<string>('{{seconds}} s', {replace: {seconds}})
          : t<string>('1 s')
        : null
    ]
      .filter((s): s is string => !!s)
      .slice(0, 2)
      .join(' ')}`;
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
