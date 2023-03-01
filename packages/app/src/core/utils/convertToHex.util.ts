import PolkadotImplementation from 'shared/services/web3/polkadot.class';

export const convertToHex = (address: string) => {
  return PolkadotImplementation.convertToHex(address);
  // const publicKey = decodeAddress(address);
  // const hexPublicKey = u8aToHex(publicKey);
  // return hexPublicKey;
};
