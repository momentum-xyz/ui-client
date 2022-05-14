import {types} from 'mobx-state-tree';
import {AbstractConnector} from '@web3-react/abstract-connector';
import {InjectedConnector} from '@web3-react/injected-connector';
import {WalletConnectConnector} from '@web3-react/walletconnect-connector';

import {endpoints} from 'api/constants';
import {Web3ConnectorEnum} from 'core/enums';
import {Web3ConnectorInterface} from 'core/interfaces';

import {LoginStore} from './LoginStore';
import {Web3ChoiceStore} from './Web3ChoiceStore';
import {Web3ChallengeStore} from './Web3ChallengeStore';
import {Web3ConsentStore} from './Web3ConsentStore';

const SUPPORTED_CHAIN_IDS: number[] = [1, 3, 4, 5, 42];
const QRCODE_OPTIONS: string[] = ['metamask', 'trust'];

const RPC_URLS: {[chainId: number]: string} = {
  1: endpoints.web3MainNet,
  4: endpoints.web3RinkeBy
};

const RootAuthStore = types
  .model('RootAuthStore', {
    loginStore: types.optional(LoginStore, {}),
    web3ChoiceStore: types.optional(Web3ChoiceStore, {}),
    web3ChallengeStore: types.optional(Web3ChallengeStore, {}),
    web3ConsentStore: types.optional(Web3ConsentStore, {})
  })
  .volatile<{web3Connectors: Web3ConnectorInterface[]}>(() => ({
    web3Connectors: []
  }))
  .actions((self) => ({
    afterCreate(): void {
      const metaMask: AbstractConnector = new InjectedConnector({
        supportedChainIds: SUPPORTED_CHAIN_IDS
      });

      const walletConnect: AbstractConnector = new WalletConnectConnector({
        rpc: RPC_URLS,
        qrcode: true,
        qrcodeModalOptions: {
          mobileLinks: QRCODE_OPTIONS,
          desktopLinks: QRCODE_OPTIONS
        }
      });

      self.web3Connectors = [
        {name: Web3ConnectorEnum.Polkadot, connector: null},
        {name: Web3ConnectorEnum.Metamask, connector: metaMask},
        {name: Web3ConnectorEnum.WalletConnect, connector: walletConnect}
      ];
    }
  }))
  .views((self) => ({
    get web3ConnectorsFiltered(): Web3ConnectorInterface[] {
      return self.web3Connectors.filter((item) => item.name === Web3ConnectorEnum.Polkadot);
    }
  }));

export {RootAuthStore};
