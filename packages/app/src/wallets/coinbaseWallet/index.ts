import {WalletConfigInterface} from 'wallets';
import icon from 'static/images/walletCoinbase.svg';

import {useWallet} from './useWallet';

const config: WalletConfigInterface = {
  name: 'Coinbase', // 'Coinbase Wallet',
  icon,
  browserExtensionUrl: 'https://www.coinbase.com/wallet/articles/getting-started-extension',
  useWallet
};

export default config;
