import {WalletConfigInterface} from 'wallets';
import icon from 'static/images/walletTalisman.svg';

import {useWallet} from './useWallet';

const config: WalletConfigInterface = {
  name: 'Talisman',
  icon,
  browserExtensionUrl: 'https://talismanwallet.com/',
  useWallet
};

export default config;
