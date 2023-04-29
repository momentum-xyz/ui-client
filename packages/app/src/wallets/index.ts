import metamask from './metamask';
import coinbaseWallet from './coinbaseWallet';
import talisman from './talisman';
import polkadot from './polkadot';
import {WalletConfigInterface} from './wallets.types';

export const availableWallets = [metamask, coinbaseWallet, talisman, polkadot];

export const storeWalletByAddress = (address: string, walletId: string) => {
  console.log('storeWalletByAddress', {address, walletId});
  localStorage.setItem(`odyssey.wallet:${address}`, walletId);
};

const dummyWalletConf: WalletConfigInterface = {
  id: 'dummy',
  name: 'Dummy',
  icon: 'wallet',
  logo: '',
  browserExtensionUrl: '',
  useWallet: () => ({
    account: null,
    accountHex: null,
    isInstalled: false,
    content: null,
    web3Library: null,
    activate: () => Promise.reject(),
    isActive: false,
    signChallenge: async () => Promise.reject()
  })
};

export const getWalletByAddress = (address: string): WalletConfigInterface => {
  const walletId = localStorage.getItem(`odyssey.wallet:${address}`);
  const walletConf = availableWallets.find((wallet) => wallet.id === walletId);
  console.log('getWalletByAddress', {address, walletId, walletConf});
  return walletConf || dummyWalletConf;
};

export * from './wallets.types';
