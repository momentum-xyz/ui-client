import {types} from 'mobx-state-tree';
import {AbstractConnector} from '@web3-react/abstract-connector';
import {InjectedConnector} from '@web3-react/injected-connector';
import {WalletConnectConnector} from '@web3-react/walletconnect-connector';

import {appVariables} from 'api/constants';
import {LoginTypeEnum} from 'core/enums';
import {Web3ConnectorInterface} from 'core/interfaces';

import {LoginStore} from './LoginStore';
import {Web3ChoiceStore} from './Web3ChoiceStore';
import {Web3ChallengeStore} from './Web3ChallengeStore';
import {Web3ConsentStore} from './Web3ConsentStore';

const SUPPORTED_CHAIN_IDS: number[] = [1, 3, 4, 5, 42];
const QRCODE_OPTIONS: string[] = ['metamask', 'trust'];

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

      const rpcUrls: {[chainId: number]: string} = {
        1: appVariables.WEB3_PUBLIC_RPC_URL_MAINNET,
        4: appVariables.WEB3_PUBLIC_RPC_URL_RINKEBY
      };

      const walletConnect: AbstractConnector = new WalletConnectConnector({
        rpc: rpcUrls,
        qrcode: true,
        qrcodeModalOptions: {
          mobileLinks: QRCODE_OPTIONS,
          desktopLinks: QRCODE_OPTIONS
        }
      });

      self.web3Connectors = [
        {name: LoginTypeEnum.Polkadot, connector: null},
        {name: LoginTypeEnum.Metamask, connector: metaMask},
        {name: LoginTypeEnum.WalletConnect, connector: walletConnect}
      ];
    },
    getWeb3Connector(name: string): Web3ConnectorInterface | null {
      return self.web3Connectors.find((item) => item.name === name) || null;
    }
  }))
  .views((self) => ({
    get web3ConnectorsFiltered(): Web3ConnectorInterface[] {
      return self.web3Connectors.filter((item) => item.name === LoginTypeEnum.Polkadot);
    }
  }));

export {RootAuthStore};
