export interface TokenDto {
  tokenName?: string;
  network?: NetworkType;
  tokenType?: TokenType;
  contractAddress?: string;
  additionalDescription?: string;
  createdAt?: string;
  updatedAt?: string;
  status?: string | null;
  worldId?: string | null;
  spaceId?: string | null;
  id?: {
    data: Buffer | undefined;
    type: string;
  };
}

export enum TokenType {
  ERC20 = 'ERC20',
  ERC721 = 'ERC721',
  ERC1155 = 'ERC1155'
}

export enum NetworkType {
  MOONBEAM = 'MOONBEAM',
  ETHEREUM = 'ETH_MAINNET'
}

export interface TokenRule {
  minBalance: number;
}

export interface TokenRuleDto {
  createdAt?: string;
  id?: {
    data: Buffer;
    type: string;
  };
  rule?: TokenRule;
  spaceAdminId?: {
    data: Buffer;
    type: string;
  };
  spaceId?: {
    data: Buffer;
    type: string;
  };
  token?: TokenDto;
  tokenRuleName?: string;
  updatedAt?: string;
}

export interface TokenRuleEnvelopeDto {
  spaceId?: string;
  tokenId?: string;
  rule?: TokenRule;
  name?: string;
}
export interface TokenResponse {
  count: number;
  status: number;
  token: TokenDto[];
}

export interface TokenRuleResponse {
  count: number;
  status: number;
  tokenRules: TokenRuleDto[];
}

export interface TokenWhitelistResonse {
  count: number;
  status: number;
  tokenWhitelistRequests: TokenRuleDto[];
}

export interface TokenWhitelistRequestActionDto {
  approved?: boolean | undefined | null;
}
