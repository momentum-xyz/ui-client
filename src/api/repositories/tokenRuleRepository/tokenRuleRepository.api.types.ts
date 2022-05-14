/** Base **/
import {NetworkTypeEnum, TokenRuleReviewStatus} from 'core/enums';
import {TokenInterface} from 'api';
import {TokenRuleItemModelInterface} from 'core/models';

export interface TokenRuleInterface {
  status: string;
  createdAt?: string;
  id: string;
  rule: RuleInterface;
  token: TokenInterface;
  tokenRuleName: string;
  updatedAt?: string;
  network: NetworkTypeEnum;
  contractAddress: string;
}

export interface TokenRuleResponseInterface {
  status: string;
  createdAt?: string;
  id: string;
  tokenGroupUserId?: string;
  name: string;
  updatedAt?: string;
  minBalance: number;
  network: string;
  contractAddress: string;
  tokenType: string;
  userName?: string;
  userId?: string;
  spaceName?: string;
}

export interface RuleInterface {
  minBalance: number;
}

export interface TokenRuleFormInterface {
  tokenId: string;
  name: string;
  minBalance: number;
}

export interface BaseTokenRulesRequest {
  spaceId?: string;
  query?: string;
  children?: boolean;
}

export interface TokenRuleSearchResultInterface {
  tokenGroupUserId: string;
  name: string;
  status: string;
}

/** FETCH TOKEN RULES **/
export interface FetchTokenRulesResponse {
  count: number;
  status: number;
  tokenRules: TokenRuleItemModelInterface[];
}

/** FETCH TOKEN RULE **/
export interface FetchTokenRuleRequest extends BaseTokenRulesRequest {
  tokenRuleId: string;
}

export interface FetchTokenRuleResponse {
  tokenRuleId: string;
}

/** CREATE TOKEN RULE **/
export interface CreateTokenRuleRequest {
  data: CreateTokenRuleInterface;
  spaceId: string;
}

export interface CreateTokenRuleInterface {
  name: string;
  tokenId: string;
  minBalance: number;
}

export interface CreateTokenRuleResponse {
  id: string;
}

/** UPDATE TOKEN RULE **/
export interface UpdateTokenRuleRequest extends BaseTokenRulesRequest {
  tokenRuleId: string;
  data: TokenRuleFormInterface;
}

export interface UpdateTokenRuleResponse {}

/** DELETE TOKEN RULE **/
export interface DeleteTokenRuleRequest {
  tokenRuleId: string;
}

export interface DeleteTokenRuleResponse {}

/** PROCESS TOKEN RULE **/

export interface ProcessTokenRuleRequest {
  tokenRuleId: string;
  status: TokenRuleReviewStatus;
}

export interface ProcessTokenRuleResponse {}

/** FETCH TOKEN RULES OPTIONS **/

export interface TokenRulesOptionResponse {
  network: string[];
  types: string[];
}
export interface TokenRulesOptionRequest {}

/** SEARCH TOKEN RULES **/

export interface TokenRuleSearchRequest {
  q: string;
}

export interface TokenRuleSearchResponse {
  results: TokenRuleItemModelInterface[];
  itemCount: number;
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

/** APPLY TOKEN RULES **/

export interface ApplyTokenRuleInterface {
  tokenGroupUserId: string;
  role: 'member' | 'admin';
}

export interface ApplyTokenRuleRequest {
  data: ApplyTokenRuleInterface;
  spaceId: string;
}

export interface ApplyTokenRuleResponse {}

export interface AppliedTokenRulesRequest {
  spaceId: string;
}
