import {types} from 'mobx-state-tree';

const PolkadotUnlockingDuration = types.model('PolkadotUnlockingDuration', {
  days: types.maybeNull(types.string),
  hours: types.maybeNull(types.string),
  minutes: types.maybeNull(types.string),
  seconds: types.maybeNull(types.string)
});

export {PolkadotUnlockingDuration};
