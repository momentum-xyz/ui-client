import {types, Instance} from 'mobx-state-tree';

const Wallet = types.model('Wallet', {
  wallet_id: types.string,
  balance: types.string,
  blockchain_name: types.string,
  reward: types.string,
  contract_id: types.string,
  updated_at: types.string,
  transferable: types.string,
  staked: types.string,
  unbonding: types.string
});

export interface WalletModelInterface extends Instance<typeof Wallet> {}

export {Wallet};
