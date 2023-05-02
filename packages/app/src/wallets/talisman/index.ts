import {WalletConfigInterface} from 'wallets';
import logo from 'static/images/walletTalisman.svg';

import {useWallet} from './useWallet';

const config: WalletConfigInterface = {
  id: 'talisman',
  name: 'Talisman',
  logo,
  icon: 'talisman',
  browserExtensionUrl: 'https://www.talisman.xyz/',
  useWallet
};

export default config;
