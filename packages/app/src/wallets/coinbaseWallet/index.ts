import {WalletConfigInterface} from 'wallets';

import {useWallet} from './useWallet';

const config: WalletConfigInterface = {
  name: 'Coinbase', // 'Coinbase Wallet',
  icon: 'https://avatars.githubusercontent.com/u/18060234?s=200&v=4', //'TODO',
  browserExtensionUrl: 'https://www.coinbase.com/wallet/articles/getting-started-extension',
  useWallet
};

export default config;
