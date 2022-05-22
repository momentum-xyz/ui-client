import {AbstractConnector} from '@web3-react/abstract-connector';

import {LoginTypeEnum} from 'core/enums';

export interface Web3ConnectorInterface {
  name: LoginTypeEnum;
  connector: AbstractConnector | null;
}
