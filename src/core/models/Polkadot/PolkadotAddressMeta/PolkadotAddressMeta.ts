import {types} from 'mobx-state-tree';

const PolkadotAddressMeta = types.model('PolkadotAddressMeta', {
  genesisHash: types.maybeNull(types.string),
  isInjected: types.boolean,
  name: types.maybe(types.string)
});

export {PolkadotAddressMeta};
