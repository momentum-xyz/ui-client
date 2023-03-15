/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  web3FromSource,
  web3FromAddress,
  isWeb3Injected,
  web3Accounts,
  web3Enable
} from '@polkadot/extension-dapp';
import {decodeAddress, encodeAddress} from '@polkadot/util-crypto';
import {
  hexToU8a,
  isHex,
  formatBalance,
  stringToHex,
  isUndefined,
  u8aToHex,
  u8aToString
} from '@polkadot/util';
import {SiDef} from '@polkadot/util/types';
import BN from 'bn.js';

import {BN_ZERO, BN_TEN} from 'core/constants/bigNumber.constants';
import {appVariables} from 'api/constants';

interface BlockChainImplementationInterface {}

type UnlockingType = {
  remainingEras: BN;
  value: BN;
};

export type UnlockingDurationReturnType = {
  days: string | null;
  hours: string | null;
  minutes: string | null;
  seconds?: string | null;
};

export type DeriveUnbondingProgressReturnType = [[UnlockingType, BN, BN][]] | [never[], BN];

export default class PolkadotImplementation implements BlockChainImplementationInterface {
  static getInjectorFromMetaSource(metaSource: string): Promise<any> {
    return web3FromSource(metaSource);
  }
  static getInjectorFromAddress(address: string): Promise<any> {
    return web3FromAddress(address);
  }

  static async signRaw(metaSource: string, hex: string, address: string): Promise<any> {
    const injector = await this.getInjectorFromMetaSource(metaSource);
    const signRaw = injector?.signer?.signRaw;

    if (signRaw) {
      const result = await signRaw({
        data: hex,
        address: address,
        type: 'bytes'
      }).catch((error: unknown) => {
        // TODO: Show some error
        console.log(error);
      });

      return result;
    }
  }

  static async signAndTransmit(): Promise<void> {
    return new Promise(() => {});
  }

  static async isExtensionEnabled(): Promise<boolean> {
    console.log('web3Enable', appVariables.POLKADOT_CONNECTION_STRING);
    const connection = await web3Enable(appVariables.POLKADOT_CONNECTION_STRING);
    console.log('web3Enable - done.');
    return connection.length !== 0 || isWeb3Injected;
  }

  // --- Helper Methods ---

  // --- --- Address Decoding & Encoding --- ---

  // decodeAddress(encoded?: string | Uint8Array | null | undefined, ignoreChecksum?: boolean | undefined, ss58Format?: number | undefined): Uint8Array
  static decodeAddress(address: string): Uint8Array {
    return decodeAddress(address);
  }

  static encodeAddress(address: string): string {
    const arr = this.isHex(address) ? this.convertHexToU8A(address) : this.decodeAddress(address);
    return encodeAddress(arr);
  }

  // --- --- --- --- --- --- --- --- --- --- ---

  // --- --- Address, Hex, and U8A Conversions --- ---
  static getPublicKeyFromAddress(address: string): Uint8Array {
    return this.decodeAddress(address);
  }

  static convertToHex(address: string): string {
    const publicKey = this.getPublicKeyFromAddress(address);
    const hexPublicKey = u8aToHex(publicKey);
    return hexPublicKey;
  }

  static convertStringToHex(str: string): string {
    return stringToHex(str);
  }

  static convertU8AToHex(arr: Uint8Array): string {
    return u8aToHex(arr);
  }

  static convertU8AToString(arr: Uint8Array): string {
    return u8aToString(arr);
  }

  static convertHexToU8A(str: string): Uint8Array {
    return hexToU8a(str);
  }

  static isHex(str: string): boolean {
    return isHex(str);
  }

  // --- --- --- --- --- --- --- --- --- --- --- --- ---

  private getSiPowers = (si: SiDef | null, decimals?: number): [BN, number, number] => {
    if (!si) {
      return [BN_ZERO, 0, 0];
    }

    const basePower = isUndefined(decimals) ? formatBalance.getDefaults().decimals : decimals;

    return [new BN(basePower + si.power), basePower, si.power];
  };

  inputToBN = (
    input: string,
    chainDecimals: number | undefined,
    tokenSymbol: string
  ): [BN, boolean] => {
    formatBalance.setDefaults({
      decimals: chainDecimals,
      unit: tokenSymbol
    });
    const si = formatBalance.findSi('-');
    const [siPower, basePower, siUnitPower] = this.getSiPowers(si);

    const isDecimalValue = input.match(/^(\d+)\.(\d+)$/);

    let result;

    if (isDecimalValue) {
      if (siUnitPower - isDecimalValue[2].length < -basePower) {
        result = new BN(-1);
      }

      const div = new BN(input.replace(/\.\d*$/, ''));
      const modString = input.replace(/^\d+\./, '').substr(0, chainDecimals);
      const mod = new BN(modString);

      result = div
        .mul(BN_TEN.pow(siPower))
        .add(mod.mul(BN_TEN.pow(new BN(basePower + siUnitPower - modString.length))));
    } else {
      result = new BN(input.replace(/[^\d]/g, '')).mul(BN_TEN.pow(siPower));
    }

    // @ts-ignore
    return result;
  };

  // --- /Helper Methods ---

  // --- Substrate Provider Methods ---
  static async getAddresses(ss58Format: number) {
    return await web3Accounts({ss58Format});
  }

  // --- /Substrate Provider Methods ---
}
