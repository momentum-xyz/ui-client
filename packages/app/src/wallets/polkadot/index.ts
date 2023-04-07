import {WalletConfigInterface} from 'wallets';
import icon from 'static/images/polkadot.svg';

import {useWallet} from './useWallet';

const config: WalletConfigInterface = {
  name: 'Polkadot', //'Polkadot{.js}',
  icon,
  browserExtensionUrl: 'https://polkadot.js.org/extension/',
  useWallet
};

export default config;
