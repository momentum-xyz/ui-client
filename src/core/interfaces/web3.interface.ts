import {AbstractConnector} from '@web3-react/abstract-connector';

import {Web3ConnectorEnum} from 'core/enums';

export interface Web3ConnectorInterface {
  name: Web3ConnectorEnum;
  connector: AbstractConnector | null;
}
