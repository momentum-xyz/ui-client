import {types, Instance} from 'mobx-state-tree';

const Wallet = types.model('Wallet', {
  hash: types.identifier,
  rewardsAmount: types.number,
  balanceAmount: types.number,
  transferableAmount: types.number,
  unbondingAmount: types.number,
  stakedAmount: types.number,
  symbol: types.string
});

export interface WalletModelInterface extends Instance<typeof Wallet> {}

export {Wallet};
