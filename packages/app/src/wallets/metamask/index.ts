import {WalletConfigInterface} from 'wallets';

import {useWallet} from './useWallet';

const config: WalletConfigInterface = {
  name: 'Metamask',
  icon: 'https://avatars.githubusercontent.com/u/18060234?s=200&v=4', //'TODO',
  browserExtensionUrl: 'https://metamask.io/download/',
  useWallet
};

export default config;
