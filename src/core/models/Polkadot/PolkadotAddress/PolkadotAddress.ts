import {Instance, types} from 'mobx-state-tree';

import {PolkadotAddressMeta} from '../PolkadotAddressMeta/PolkadotAddressMeta';

const PolkadotAddress = types.model('PolkadotAddress', {
  address: types.string,
  meta: types.maybeNull(PolkadotAddressMeta),
  type: types.maybe(
    types.union(
      types.literal('ed25519'),
      types.literal('sr25519'),
      types.literal('ecdsa'),
      types.literal('ethereum')
    )
  )
});

export interface PolkadotAddressInterface extends Instance<typeof PolkadotAddress> {}

export {PolkadotAddress};
