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
  extractTime,
  formatBalance
} from '@polkadot/util';
import {DeriveSessionProgress, DeriveStakingAccount} from '@polkadot/api-derive/types';
import {t} from 'i18next';
import {keyring} from '@polkadot/ui-keyring';
import {KeyringJson$Meta} from '@polkadot/ui-keyring/types';
import {KeypairType} from '@polkadot/util-crypto/types';
import {IU8a} from '@polkadot/types-codec/types/interfaces';

import {appVariables} from 'api/constants';

type UnlockingType = {
  remainingEras: BN;
  value: BN;
};

type InjectedAddressType = {
  address: string;
  meta: KeyringJson$Meta;
  type?: KeypairType;
};

export type UnlockingDurationReturnType = {
  days: string | null;
  hours: string | null;
  minutes: string | null;
  seconds?: string | null;
};

export type DeriveUnbondingProgressReturnType = [[UnlockingType, BN, BN][]] | [never[], BN];

export default class SubstrateProvider {
  static FORMAT_OPTIONS = {withSi: false, forceUnit: '-'};

  static async initAPI() {
    const provider = new WsProvider(appVariables.KUSAMA_WS_SERVER);
    return ApiPromise.create({provider});
  }

  static async isExtensionEnabled() {
    const connection = await web3Enable(appVariables.POLKADOT_CONNECTION_STRING);
    return connection.length !== 0 || isWeb3Injected;
  }

  static isKeyringLoaded() {
    try {
      return !!keyring.keyring;
    } catch {
      return false;
    }
  }

  static loadToKeyring(
    InjectedAddress: InjectedAddressType[],
    ss58Format: number | undefined,
    genesisHash: IU8a | undefined
  ) {
    SubstrateProvider.isKeyringLoaded() ||
      keyring.loadAll(
        {
          genesisHash,
          ss58Format
        },
        InjectedAddress
      );
  }

  static async getAddresses(ss58Format = 2) {
    return await web3Accounts({ss58Format});
  }

  static deriveUnlockingProgress(
    stakingInfo: DeriveStakingAccount | null,
    progress: DeriveSessionProgress | null
  ): DeriveUnbondingProgressReturnType {
    if (!stakingInfo?.unlocking || !progress) {
      return [[], BN_ZERO];
    } else {
      const mapped = stakingInfo.unlocking
        .filter(({remainingEras, value}) => value.gt(BN_ZERO) && remainingEras.gt(BN_ZERO))
        .map((unlock): [UnlockingType, BN, BN] => [
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
          days: days ? (days > 1 ? t('time.days', {days}) : t('time.days', {days: 1})) : null,
          hours: hours
            ? hours > 1
              ? t('time.hours', {hours})
              : t('time.hours', {hours: 1})
            : null,
          minutes: minutes
            ? minutes > 1
              ? t('time.minutes', {minutes})
              : t('time.minutes', {minutes: 1})
            : null,
          seconds: seconds
            ? seconds > 1
              ? t('time.seconds', {seconds})
              : t('time.seconds', {seconds: 1})
            : null
        };
  }

  static setDefaultBalanceFormatting(chainDecimals = 2, chainTokens = 'KSM') {
    formatBalance.setDefaults({
      decimals: chainDecimals,
      unit: chainTokens
    });
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
