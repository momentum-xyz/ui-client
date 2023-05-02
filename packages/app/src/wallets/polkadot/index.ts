import {WalletConfigInterface} from 'wallets';
import logo from 'static/images/polkadot.svg';

import {useWallet} from './useWallet';

const config: WalletConfigInterface = {
  id: 'polkadot',
  name: 'Polkadot', //'Polkadot{.js}',
  logo,
  icon: 'polkadotprofile',
  browserExtensionUrl: 'https://polkadot.js.org/extension/',
  useWallet
};

export default config;
