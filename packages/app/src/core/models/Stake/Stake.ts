import {types, Instance} from 'mobx-state-tree';

const Stake = types.model('Stake', {
  wallet_id: types.string,
  amount: types.string,
  blockchain_id: types.string,
  lastComment: types.maybeNull(types.string),
  name: types.string,
  object_id: types.string,
  reward: types.maybeNull(types.string),
  updatedAt: types.string
});

export interface StakeModelInterface extends Instance<typeof Stake> {}

export {Stake};
