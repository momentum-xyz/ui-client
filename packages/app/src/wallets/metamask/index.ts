import {WalletConfigInterface} from 'wallets';
import logo from 'static/images/walletMetamask.svg';

import {useWallet} from './useWallet';

const config: WalletConfigInterface = {
  id: 'metamask',
  name: 'Metamask',
  logo,
  icon: 'metamask',
  browserExtensionUrl: 'https://metamask.io/download/',
  useWallet
};

export default config;
