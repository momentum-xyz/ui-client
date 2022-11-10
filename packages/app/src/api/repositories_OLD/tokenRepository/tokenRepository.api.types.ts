import {TokenTypeEnum} from 'core/enums';
import {TokenItemModelInterface} from 'core/models';
import {TokenFormInterface} from 'core/interfaces';

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
  data: TokenFormInterface;
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
