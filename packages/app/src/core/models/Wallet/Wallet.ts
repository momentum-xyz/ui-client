import {types, Instance} from 'mobx-state-tree';

const Wallet = types.model('Wallet', {
  wallet_id: types.string,
  balance: types.string,
  blockchain_name: types.string,
  contract_id: types.string,
  updated_at: types.string,
  transferable: types.maybe(types.string),
  staked: types.maybe(types.string),
  unbonding: types.maybe(types.string)
});

export interface WalletModelInterface extends Instance<typeof Wallet> {}

export {Wallet};
