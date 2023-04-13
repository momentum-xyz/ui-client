import {types, Instance} from 'mobx-state-tree';

const Stake = types.model('Stake', {
  uuid: types.identifier,
  nftId: types.string,
  nftName: types.string,
  nftImage: types.maybeNull(types.string),
  wallet: types.string,
  userId: types.string,
  userName: types.string,
  stakedAmount: 0,
  rewardAmount: 0,
  tokenSymbol: types.string
});

export interface StakeModelInterface extends Instance<typeof Stake> {}

export {Stake};
