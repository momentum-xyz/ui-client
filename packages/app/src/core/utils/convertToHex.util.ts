import {decodeAddress} from '@polkadot/util-crypto';
import {u8aToHex} from '@polkadot/util';

export const convertToHex = (address: string) => {
  const publicKey = decodeAddress(address);
  const hexPublicKey = u8aToHex(publicKey);
  return hexPublicKey;
};
