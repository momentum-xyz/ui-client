import {TokenTypeEnum} from 'core/enums';
import {TokenItemModelInterface} from 'core/models';

export interface TokenInterface {
  name: string;
  contractAddress?: string;
  tokenType?: TokenTypeEnum;
  createdAt?: string;
  updatedAt?: string;
  status?: string;
  worldId?: string;
  spaceId?: string;
  id: string;
}

export interface TokenFormInterface {
  tokenType: TokenTypeEnum;
  tokenID?: string;
  network: string;
  contractAddress: string;
  tokenName: string;
}

export interface FetchTokensResponse {
  tokens: TokenInterface[];
}

export interface BaseTokensRequest {}

export interface TokenNameRequest {
  address: string;
  network: string;
}

export interface FetchTokenNameResponse {
  tokenNames: string[];
}

export interface CreateTokenRequest {
  tokenType: TokenTypeEnum;
  tokenID?: string;
  network: string;
  contractAddress: string;
  tokenName: string;
}
export interface CreateTokenResponse {
  message: TokenInterface;
}

export interface TokenSearchRequest {
  q: string;
}

export interface TokenSearchResponse {
  results: TokenItemModelInterface[];
  itemCount: number;
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}
