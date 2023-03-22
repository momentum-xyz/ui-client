import {ApiPromise, WsProvider} from '@polkadot/api';
import {bnMin, extractTime, formatBalance} from '@polkadot/util';
import {DeriveSessionProgress, DeriveStakingAccount} from '@polkadot/api-derive/types';
import BN from 'bn.js';
import {keyring} from '@polkadot/ui-keyring';
import {KeyringJson$Meta} from '@polkadot/ui-keyring/types';
import {KeypairType} from '@polkadot/util-crypto/types';
import {IU8a} from '@polkadot/types-codec/types/interfaces';
import {i18n} from '@momentum-xyz/core';

import {appVariables} from 'api/constants';
import {BN_MAX_INTEGER, BN_ONE, BN_ZERO} from 'core/constants';

import PolkadotImplementation from './polkadot.class';

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
    console.log('Connecting to Substrate node', appVariables.BLOCKCHAIN_WS_SERVER);
    const provider = new WsProvider(appVariables.BLOCKCHAIN_WS_SERVER);
    return ApiPromise.create({provider});
  }

  static async isExtensionEnabled(): Promise<boolean> {
    const result = await PolkadotImplementation.isExtensionEnabled();
    return result;
  }

  static async getAddresses(ss58Format = 2) {
    console.log('Get web3Accounts in format', ss58Format);
    return await PolkadotImplementation.getAddresses(ss58Format);
  }

  static isKeyringLoaded() {
    try {
      return !!keyring.keyring;
    } catch {
      return false;
    }
  }

  static getKeyringAddresses() {
    const keyringAccounts = keyring.getAccounts();
    return keyringAccounts.map((account) => {
      const {address, meta, publicKey} = account;
      return {
        address,
        meta,
        publicKey: publicKey.toString()
      };
    });
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
          days: days
            ? days > 1
              ? i18n.t('time.days', {days})
              : i18n.t('time.days', {days: 1})
            : null,
          hours: hours
            ? hours > 1
              ? i18n.t('time.hours', {hours})
              : i18n.t('time.hours', {hours: 1})
            : null,
          minutes: minutes
            ? minutes > 1
              ? i18n.t('time.minutes', {minutes})
              : i18n.t('time.minutes', {minutes: 1})
            : null,
          seconds: seconds
            ? seconds > 1
              ? i18n.t('time.seconds', {seconds})
              : i18n.t('time.seconds', {seconds: 1})
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
      PolkadotImplementation.encodeAddress(address);
      return true;
    } catch (error) {
      return false;
    }
  }
}
