import {Instance, types} from 'mobx-state-tree';

const PolkadotAddress = types.model('PolkadotAddress', {
  address: types.string,
  meta: types.optional(types.frozen(), null),
  publicKey: types.optional(types.frozen(), '')
});

export interface PolkadotAddressInterface extends Instance<typeof PolkadotAddress> {}

export {PolkadotAddress};
