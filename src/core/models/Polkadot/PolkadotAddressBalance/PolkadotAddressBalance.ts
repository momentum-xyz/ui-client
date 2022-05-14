import {types} from 'mobx-state-tree';

const PolkadotAddressBalance = types.model('PolkadotAddressBalance', {
  total: types.string,
  transferable: types.string,
  locked: types.string,
  redeemable: types.string,
  bonded: types.string,
  unbonding: types.string,
  transferableWithoutFee: types.string
});

export {PolkadotAddressBalance};
