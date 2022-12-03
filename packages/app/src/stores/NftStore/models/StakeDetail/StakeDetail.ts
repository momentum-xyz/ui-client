import {Instance, types} from 'mobx-state-tree';

export const StakeDetail = types.model('StakeDetail', {
  sourceAddr: types.string,
  destAddr: types.string,
  // destNftItemId: types.number,
  amount: types.number
});

export interface StakeDetailInterface extends Instance<typeof StakeDetail> {}
