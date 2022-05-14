import {types} from 'mobx-state-tree';

const PolkadotAddressMeta = types.model('PolkadotAddressMeta', {
  genesisHash: types.maybeNull(types.string),
  name: types.maybe(types.string),
  source: types.string
});

export {PolkadotAddressMeta};
