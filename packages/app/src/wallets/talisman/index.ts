import {WalletConfigInterface} from 'wallets';
import icon from 'static/images/walletTalisman.svg';

import {useWallet} from './useWallet';

const config: WalletConfigInterface = {
  name: 'Talisman',
  icon,
  browserExtensionUrl: 'https://www.talisman.xyz/',
  useWallet
};

export default config;
