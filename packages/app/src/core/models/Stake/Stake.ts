import {types, Instance} from 'mobx-state-tree';

const Stake = types.model('Stake', {
  wallet_id: types.string,
  name: types.string,
  avatar_hash: types.maybeNull(types.string),
  object_id: types.string,
  amount: types.string,
  reward: types.string,
  blockchain_id: types.string,
  kind: types.number,
  last_comment: types.maybeNull(types.string),
  updated_at: types.string
});

export interface StakeModelInterface extends Instance<typeof Stake> {}

export {Stake};
