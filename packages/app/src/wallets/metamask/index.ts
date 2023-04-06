import {WalletConfigInterface} from 'wallets';
import icon from 'static/images/walletMetamask.svg';

import {useWallet} from './useWallet';

const config: WalletConfigInterface = {
  name: 'Metamask',
  icon,
  browserExtensionUrl: 'https://metamask.io/download/',
  useWallet
};

export default config;
