import metamask from './metamask';
import coinbaseWallet from './coinbaseWallet';
import talisman from './talisman';
import polkadot from './polkadot';
import {WalletConfigInterface} from './wallets.types';

export const availableWallets = [metamask, coinbaseWallet, talisman, polkadot];

export const dummyWalletConf: WalletConfigInterface = {
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

export * from './wallets.types';
