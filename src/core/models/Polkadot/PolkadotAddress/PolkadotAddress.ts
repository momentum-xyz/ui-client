import {Instance, types} from 'mobx-state-tree';

import {PolkadotAddressMeta} from '../PolkadotAddressMeta/PolkadotAddressMeta';

const PolkadotAddress = types.model('PolkadotAddress', {
  address: types.string,
  meta: types.maybeNull(PolkadotAddressMeta),
  publicKey: types.string
});

export interface PolkadotAddressInterface extends Instance<typeof PolkadotAddress> {}

export {PolkadotAddress};
