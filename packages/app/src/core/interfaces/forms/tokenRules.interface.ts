import {TokenTypeEnum} from 'core/enums';

export interface TokenFormInterface {
  tokenType: TokenTypeEnum;
  tokenID?: string;
  network: string;
  contractAddress: string;
  tokenName: string;
}

export interface TokenRuleFormInterface {
  tokenId: string;
  name: string;
  minBalance: number;
}
