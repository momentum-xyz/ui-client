import {WalletConfigInterface} from 'wallets';

import {useWallet} from './useWallet';

const config: WalletConfigInterface = {
  name: 'Talisman',
  icon: 'https://avatars.githubusercontent.com/u/18060234?s=200&v=4', // 'TODO',
  browserExtensionUrl: 'https://talismanwallet.com/',
  useWallet
};

export default config;
