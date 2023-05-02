import {WalletConfigInterface} from 'wallets';
import logo from 'static/images/walletCoinbase.svg';

import {useWallet} from './useWallet';

const config: WalletConfigInterface = {
  id: 'coinbase',
  name: 'Coinbase', // 'Coinbase Wallet',
  logo,
  icon: 'coinbase',
  browserExtensionUrl: 'https://www.coinbase.com/wallet/articles/getting-started-extension',
  useWallet
};

export default config;
